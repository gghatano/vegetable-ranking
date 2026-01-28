import React, { useState, useEffect } from 'react';

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
  'ネギ': '🧅',
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

const VegetableRankingApp = () => {
  const [screen, setScreen] = useState('ranking');
  const [vegetables, setVegetables] = useState([]);
  const [ranking, setRanking] = useState([null, null, null]);
  const [comments, setComments] = useState({});
  const [newVeggie, setNewVeggie] = useState('');
  const [draggedVeggie, setDraggedVeggie] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

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

  const handleDragStart = (e, veggie, source, listIndex = null) => {
    setDraggedVeggie({ veggie, source, listIndex });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleListDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleListDrop = (e, dropIndex) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    if (!draggedVeggie || draggedVeggie.source !== 'list') return;
    
    const dragIndex = draggedVeggie.listIndex;
    if (dragIndex === dropIndex) return;
    
    const newVegetables = [...vegetables];
    const [removed] = newVegetables.splice(dragIndex, 1);
    newVegetables.splice(dropIndex, 0, removed);
    
    setVegetables(newVegetables);
    setDraggedVeggie(null);
  };

  const handleDrop = (e, rankIndex) => {
    e.preventDefault();
    if (!draggedVeggie) return;

    const newRanking = [...ranking];
    
    if (draggedVeggie.source === 'list') {
      // リストからランキングへドロップする場合
      // 既に埋まっている位置なら、それ以降を下にずらす
      if (newRanking[rankIndex] !== null) {
        // rankIndexから下の要素をずらす
        for (let i = 2; i > rankIndex; i--) {
          newRanking[i] = newRanking[i - 1];
        }
      }
      newRanking[rankIndex] = draggedVeggie.veggie;
    } else if (draggedVeggie.source.startsWith('rank-')) {
      // ランキング内での移動
      const sourceIndex = parseInt(draggedVeggie.source.split('-')[1]);
      const temp = newRanking[rankIndex];
      newRanking[rankIndex] = newRanking[sourceIndex];
      newRanking[sourceIndex] = temp;
    }
    
    setRanking(newRanking);
    setDraggedVeggie(null);
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

  const availableVeggies = vegetables.filter(v => !ranking.includes(v));

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
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-center mb-4 lg:mb-8 text-green-700">野菜ランキング作成</h1>

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-8">
          {/* モバイル: 上部 / PC: 右側 - ランキングエリア */}
          <div className="order-1 lg:order-2 lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 lg:sticky lg:top-8">
              <h2 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4">ランキング</h2>
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-0 lg:space-y-3">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className="border-2 border-dashed rounded-lg p-2 lg:p-3 min-h-[100px] lg:min-h-[120px] border-gray-300 hover:border-green-400 hover:bg-green-50 transition-colors"
                  >
                    <div className="text-xs lg:text-sm font-semibold text-gray-600 mb-1 lg:mb-2">{index + 1}位</div>
                    {ranking[index] ? (
                      <div className="bg-green-100 p-2 lg:p-3 rounded">
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, ranking[index], `rank-${index}`)}
                          className="font-medium text-center mb-1 lg:mb-2 cursor-move hover:text-green-700 flex justify-between items-center text-xs lg:text-base"
                        >
                          <span className="flex-grow truncate"><span className="mr-1">{getVegetableIcon(ranking[index])}</span>{ranking[index]}</span>
                          <button
                            onClick={() => removeFromRanking(index)}
                            className="text-red-500 hover:text-red-700 ml-1 lg:ml-2 flex-shrink-0"
                          >
                            ✕
                          </button>
                        </div>
                        <textarea
                          placeholder="コメント"
                          value={comments[ranking[index]] || ''}
                          onChange={(e) => updateComment(ranking[index], e.target.value)}
                          className="w-full text-xs lg:text-sm px-1 lg:px-2 py-1 border border-gray-200 rounded resize-none focus:outline-none focus:border-green-500 bg-white hidden lg:block"
                          rows="2"
                        />
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center text-xs lg:text-sm">ここにドラッグ</div>
                    )}
                  </div>
                ))}
              </div>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 max-h-[calc(100vh-420px)] lg:max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                {availableVeggies.map((veggie, index) => {
                  const actualIndex = vegetables.indexOf(veggie);
                  return (
                    <div
                      key={veggie}
                      draggable
                      onDragStart={(e) => handleDragStart(e, veggie, 'list', actualIndex)}
                      onDragOver={(e) => handleListDragOver(e, actualIndex)}
                      onDrop={(e) => handleListDrop(e, actualIndex)}
                      className={`border-2 rounded-lg p-2 md:p-3 cursor-move hover:shadow-md transition-all ${
                        dragOverIndex === actualIndex && draggedVeggie?.source === 'list'
                          ? 'border-blue-400 bg-blue-50'
                          : getVegetableColor(veggie)
                      }`}
                    >
                      <div className="font-medium text-center mb-2 text-sm md:text-base">
                        <span className="mr-1">{getVegetableIcon(veggie)}</span>{veggie}
                      </div>
                      <textarea
                        placeholder="コメント"
                        value={comments[veggie] || ''}
                        onChange={(e) => updateComment(veggie, e.target.value)}
                        className="w-full text-sm px-2 py-1 border border-gray-200 rounded resize-none focus:outline-none focus:border-green-400"
                        rows="2"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VegetableRankingApp;
