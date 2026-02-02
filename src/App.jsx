import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DEFAULT_VEGETABLES = [
  // 赤系
  'トマト',
  // オレンジ系
  'にんじん', 'かぼちゃ',
  // 黄色系
  'たまねぎ', 'とうもろこし', 'もやし', 'えのき',
  // 緑系（濃い）
  'ピーマン', 'ほうれん草', 'ブロッコリー', 'いんげん',
  // 緑系（中間）
  'きゅうり', 'レタス', 'アスパラガス', 'ズッキーニ', 'さやえんどう', 'オクラ',
  // 緑系（薄い）
  'キャベツ', '白菜', 'ネギ',
  // 紫系
  'なす',
  // 茶・アンバー系
  'しいたけ', 'まいたけ', 'しめじ', 'ごぼう',
  // 白・グレー系
  'じゃがいも', 'カリフラワー', '大根', 'エリンギ', 'れんこん'
];

const VEGETABLE_ICONS = {
  'トマト': '🍅',
  'きゅうり': '🥒',
  'なす': '🍆',
  'ピーマン': '🫑',
  'にんじん': '🥕',
  'じゃがいも': '🥔',
  'たまねぎ': '🧅',
  'キャベツ': '🥬',
  'レタス': '🥗',
  'ほうれん草': '🥬',
  'ブロッコリー': '🥦',
  'カリフラワー': '🥦',
  'アスパラガス': '🌿',
  'かぼちゃ': '🎃',
  'ズッキーニ': '🥒',
  'とうもろこし': '🌽',
  'さやえんどう': '🫛',
  'いんげん': '🫛',
  'オクラ': '🌿',
  '大根': '🥬',
  '白菜': '🥬',
  'ネギ': '🌱',
  'もやし': '🌱',
  'しいたけ': '🍄',
  'えのき': '🍄',
  'しめじ': '🍄',
  'まいたけ': '🍄',
  'エリンギ': '🍄',
  'ごぼう': '🥜',
  'れんこん': '🪷'
};

const VEGETABLE_COLORS = {
  'トマト': 'bg-red-100 border-red-300',
  'きゅうり': 'bg-green-100 border-green-300',
  'なす': 'bg-purple-100 border-purple-300',
  'ピーマン': 'bg-green-200 border-green-400',
  'にんじん': 'bg-orange-100 border-orange-300',
  'じゃがいも': 'bg-yellow-50 border-yellow-200',
  'たまねぎ': 'bg-yellow-100 border-yellow-300',
  'キャベツ': 'bg-green-50 border-green-200',
  'レタス': 'bg-green-100 border-green-300',
  'ほうれん草': 'bg-green-200 border-green-400',
  'ブロッコリー': 'bg-green-200 border-green-400',
  'カリフラワー': 'bg-gray-50 border-gray-200',
  'アスパラガス': 'bg-green-100 border-green-300',
  'かぼちゃ': 'bg-orange-200 border-orange-400',
  'ズッキーニ': 'bg-green-100 border-green-300',
  'とうもろこし': 'bg-yellow-100 border-yellow-300',
  'さやえんどう': 'bg-green-100 border-green-300',
  'いんげん': 'bg-green-200 border-green-400',
  'オクラ': 'bg-green-100 border-green-300',
  '大根': 'bg-gray-50 border-gray-200',
  '白菜': 'bg-green-50 border-green-200',
  'ネギ': 'bg-green-50 border-green-200',
  'もやし': 'bg-yellow-50 border-yellow-200',
  'しいたけ': 'bg-amber-100 border-amber-300',
  'えのき': 'bg-yellow-50 border-yellow-200',
  'しめじ': 'bg-amber-50 border-amber-200',
  'まいたけ': 'bg-amber-100 border-amber-300',
  'エリンギ': 'bg-gray-100 border-gray-300',
  'ごぼう': 'bg-amber-100 border-amber-300',
  'れんこん': 'bg-gray-50 border-gray-200'
};

const getVegetableColor = (veggie) => {
  return VEGETABLE_COLORS[veggie] || 'bg-green-50 border-green-200';
};

const getVegetableIcon = (veggie) => {
  return VEGETABLE_ICONS[veggie] || '🥬';
};

// ドラッグ中のオーバーレイカード
const DragOverlayCard = ({ veggie }) => {
  return (
    <div className={`border-2 rounded-lg p-3 shadow-xl ${getVegetableColor(veggie)} opacity-95 cursor-grabbing`}>
      <div className="font-medium text-center text-sm md:text-base">
        <span className="mr-1">{getVegetableIcon(veggie)}</span>{veggie}
      </div>
    </div>
  );
};

// 野菜リスト内のソート可能なカード
const SortableVeggieCard = ({ veggie, comments, updateComment }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: `list-${veggie}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-2 rounded-lg transition-all flex ${
        isSortableDragging ? 'opacity-40 scale-95' : ''
      } ${getVegetableColor(veggie)}`}
    >
      {/* ドラッグハンドル - タッチターゲットを広く取る */}
      <div
        {...attributes}
        {...listeners}
        className="flex-shrink-0 w-10 md:w-12 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none bg-black/5 rounded-l-md hover:bg-black/10 transition-colors"
      >
        <span className="text-gray-400 text-lg select-none">⋮⋮</span>
      </div>

      {/* カード内容 */}
      <div className="flex-grow p-2 min-w-0">
        <div className="font-medium text-sm md:text-base truncate">
          <span className="mr-1">{getVegetableIcon(veggie)}</span>{veggie}
        </div>
        <input
          type="text"
          placeholder="選んだ理由を一言..."
          value={comments[veggie] || ''}
          onChange={(e) => updateComment(veggie, e.target.value)}
          className="w-full text-xs md:text-sm px-2 py-1 mt-1 border border-gray-200 rounded focus:outline-none focus:border-green-400"
        />
      </div>
    </div>
  );
};

// ランキングスロット（ドロップ可能）
const RankingSlot = ({ index, veggie, comments, updateComment, removeFromRanking, isOver }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `rank-${index}`, disabled: !veggie });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-2 border-dashed rounded-lg p-2 lg:p-3 min-h-[100px] lg:min-h-[120px] transition-all ${
        isOver ? 'border-green-500 bg-green-100 scale-[1.02]' : 'border-gray-300'
      } ${isDragging ? 'opacity-40' : ''}`}
    >
      <div className="text-xs lg:text-sm font-semibold text-gray-600 mb-1 lg:mb-2">{index + 1}位</div>
      {veggie ? (
        <div className="bg-green-100 rounded flex">
          {/* ドラッグハンドル */}
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 w-8 lg:w-10 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none bg-green-200/50 rounded-l hover:bg-green-200 transition-colors"
          >
            <span className="text-green-600 text-sm lg:text-lg select-none">⋮⋮</span>
          </div>

          {/* カード内容 */}
          <div className="flex-grow p-1.5 lg:p-2 min-w-0">
            <div className="flex justify-between items-center">
              <span className="font-medium truncate text-xs lg:text-base">
                <span className="mr-1">{getVegetableIcon(veggie)}</span>{veggie}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromRanking(index);
                }}
                className="text-red-500 hover:text-red-700 ml-1 flex-shrink-0 text-xs lg:text-base"
              >
                ✕
              </button>
            </div>
            <textarea
              placeholder="選んだ理由を一言..."
              value={comments[veggie] || ''}
              onChange={(e) => updateComment(veggie, e.target.value)}
              className="w-full text-xs lg:text-sm px-1 lg:px-2 py-1 mt-1 border border-gray-200 rounded resize-none focus:outline-none focus:border-green-500 bg-white hidden lg:block"
              rows="2"
            />
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-center text-xs lg:text-sm py-4">ここにドラッグ</div>
      )}
    </div>
  );
};

const VegetableRankingApp = () => {
  const [screen, setScreen] = useState('ranking');
  const [vegetables, setVegetables] = useState([]);
  const [ranking, setRanking] = useState([null, null, null]);
  const [comments, setComments] = useState({});
  const [newVeggie, setNewVeggie] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [overRankIndex, setOverRankIndex] = useState(null);

  // タッチとマウス両対応のセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    const saved = localStorage.getItem('vegetableRanking');
    if (saved) {
      const data = JSON.parse(saved);
      setVegetables(data.vegetables?.length > 0 ? data.vegetables : DEFAULT_VEGETABLES);
      setRanking(data.ranking?.length === 3 ? data.ranking : [null, null, null]);
      setComments(data.comments || {});
    } else {
      setVegetables(DEFAULT_VEGETABLES);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vegetableRanking', JSON.stringify({
      vegetables,
      ranking,
      comments
    }));
  }, [vegetables, ranking, comments]);

  const availableVeggies = vegetables.filter(v => !ranking.includes(v));

  // ドラッグ開始
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // ドラッグ中（オーバー時）
  const handleDragOver = (event) => {
    const { over } = event;
    if (over && over.id.toString().startsWith('rank-')) {
      const index = parseInt(over.id.toString().split('-')[1]);
      setOverRankIndex(index);
    } else {
      setOverRankIndex(null);
    }
  };

  // ドラッグ終了
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setOverRankIndex(null);

    if (!over) return;

    const activeIdStr = active.id.toString();
    const overIdStr = over.id.toString();

    // リスト内での並び替え
    if (activeIdStr.startsWith('list-') && overIdStr.startsWith('list-')) {
      const activeVeggie = activeIdStr.replace('list-', '');
      const overVeggie = overIdStr.replace('list-', '');

      const oldIndex = vegetables.indexOf(activeVeggie);
      const overIndex = vegetables.indexOf(overVeggie);

      if (oldIndex !== overIndex) {
        setVegetables(arrayMove(vegetables, oldIndex, overIndex));
      }
    }
    // リストからランキングへ
    else if (activeIdStr.startsWith('list-') && overIdStr.startsWith('rank-')) {
      const veggie = activeIdStr.replace('list-', '');
      const rankIndex = parseInt(overIdStr.split('-')[1]);

      const newRanking = [...ranking];
      // 既に埋まっている位置なら、それ以降を下にずらす
      if (newRanking[rankIndex] !== null) {
        for (let i = 2; i > rankIndex; i--) {
          newRanking[i] = newRanking[i - 1];
        }
      }
      newRanking[rankIndex] = veggie;
      setRanking(newRanking);
    }
    // ランキング内での並び替え
    else if (activeIdStr.startsWith('rank-') && overIdStr.startsWith('rank-')) {
      const sourceIndex = parseInt(activeIdStr.split('-')[1]);
      const targetIndex = parseInt(overIdStr.split('-')[1]);

      if (sourceIndex !== targetIndex) {
        const newRanking = [...ranking];
        const temp = newRanking[targetIndex];
        newRanking[targetIndex] = newRanking[sourceIndex];
        newRanking[sourceIndex] = temp;
        setRanking(newRanking);
      }
    }
  };

  const removeFromRanking = (index) => {
    const newRanking = [...ranking];
    newRanking[index] = null;
    setRanking(newRanking);
  };

  const addVegetable = () => {
    if (newVeggie.trim() && !vegetables.includes(newVeggie.trim())) {
      setVegetables([...vegetables, newVeggie.trim()]);
      setNewVeggie('');
    }
  };

  const updateComment = (veggie, comment) => {
    setComments({ ...comments, [veggie]: comment });
  };

  const resetRanking = () => {
    if (window.confirm('ランキングをリセットしますか?')) {
      setRanking([null, null, null]);
      setComments({});
    }
  };

  const copyToClipboard = () => {
    const medals = ['🥇', '🥈', '🥉'];
    const rankingText = ranking
      .map((veggie, index) => {
        if (!veggie) return null;
        const comment = comments[veggie] ? `\n  ${comments[veggie]}` : '';
        return `${medals[index]} ${index + 1}位 ${veggie}${comment}`;
      })
      .filter(Boolean)
      .join('\n\n');

    const text = `🥬 私の野菜ランキング 🥬

${rankingText}

▶ あなたも作ってみよう！
https://gghatano.github.io/vegetable-ranking/`;

    navigator.clipboard.writeText(text).then(() => {
      alert(`クリップボードにコピーしました！\n\n--- コピーした内容 ---\n${text}`);
    });
  };

  // アクティブなアイテムの野菜名を取得
  const getActiveVeggie = () => {
    if (!activeId) return null;
    const idStr = activeId.toString();
    if (idStr.startsWith('list-')) {
      return idStr.replace('list-', '');
    } else if (idStr.startsWith('rank-')) {
      const index = parseInt(idStr.split('-')[1]);
      return ranking[index];
    }
    return null;
  };

  if (screen === 'result') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-green-700">野菜ランキング結果</h1>

            <div className="space-y-4 mb-8">
              {ranking.map((veggie, index) => {
                const medals = ['🥇', '🥈', '🥉'];
                return veggie && (
                  <div key={index} className="flex items-start border-b pb-4">
                    <div className="flex-shrink-0 w-20 text-center">
                      <span className="text-2xl">{medals[index]}</span>
                      <span className="text-lg font-bold text-green-600 ml-1">{index + 1}位</span>
                    </div>
                    <div className="flex-grow ml-4">
                      <div className="text-xl font-semibold mb-2">
                          <span className="mr-2">{getVegetableIcon(veggie)}</span>{veggie}
                        </div>
                      {comments[veggie] && (
                        <div className="text-gray-600 bg-gray-50 p-3 rounded">
                          {comments[veggie]}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setScreen('ranking')}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                編集に戻る
              </button>
              <button
                onClick={copyToClipboard}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                出力
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold text-center mb-4 lg:mb-8 text-green-700">野菜ランキング作成</h1>

          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-8">
            {/* モバイル: 上部 / PC: 右側 - ランキングエリア */}
            <div className="order-1 lg:order-2 lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 lg:sticky lg:top-8">
                <h2 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4">ランキング</h2>
                <SortableContext
                  items={[0, 1, 2].map(i => `rank-${i}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-0 lg:space-y-3">
                    {[0, 1, 2].map((index) => (
                      <RankingSlot
                        key={index}
                        index={index}
                        veggie={ranking[index]}
                        comments={comments}
                        updateComment={updateComment}
                        removeFromRanking={removeFromRanking}
                        isOver={overRankIndex === index}
                      />
                    ))}
                  </div>
                </SortableContext>

                <div className="mt-3 lg:mt-4 flex flex-row lg:flex-col gap-2">
                  <button
                    onClick={() => setScreen('result')}
                    className="flex-1 lg:w-full px-3 lg:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm lg:text-base"
                  >
                    結果を見る
                  </button>
                  <button
                    onClick={resetRanking}
                    className="flex-1 lg:w-full px-3 lg:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm lg:text-base"
                  >
                    リセット
                  </button>
                </div>
              </div>
            </div>

            {/* モバイル: 下部 / PC: 左側 - 野菜リスト */}
            <div className="order-2 lg:order-1 lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
                <div className="mb-4">
                  <h2 className="text-lg lg:text-xl font-bold mb-3">野菜を追加</h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newVeggie}
                      onChange={(e) => setNewVeggie(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addVegetable()}
                      placeholder="野菜名を入力"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm lg:text-base"
                    />
                    <button
                      onClick={addVegetable}
                      className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm lg:text-base"
                    >
                      追加
                    </button>
                  </div>
                </div>

                <h2 className="text-lg lg:text-xl font-bold mb-3">野菜リスト</h2>
                <SortableContext
                  items={availableVeggies.map(v => `list-${v}`)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 max-h-[calc(100vh-420px)] lg:max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                    {availableVeggies.map((veggie) => (
                      <SortableVeggieCard
                        key={veggie}
                        veggie={veggie}
                        comments={comments}
                        updateComment={updateComment}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ドラッグ中のオーバーレイ */}
      <DragOverlay>
        {activeId && getActiveVeggie() ? (
          <DragOverlayCard veggie={getActiveVeggie()} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default VegetableRankingApp;
