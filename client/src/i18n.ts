const en = {
  title: 'Planning Poker',
  coinUp: 'Turn cards face-up',
  coinDown: 'Turn cards face-down',
  clear: 'Clear cards',
  fwLoad: 'Load the fireworks',
  fwUnload: 'Unload the fireworks',
  card: "{name}'s card",
  cardDown: "{name}'s face-down card",
  play: 'Play {card}',
  takeBack: 'Take back {card}',
  changeInitials: 'Change your initials',
  copyLink: 'Copy room link',
  fullscreen: 'Fullscreen',
  reconnecting: 'Reconnecting',
  nameInput: 'Your initials or an emoji',
  sit: 'Sit down',
  calcShelve: 'Put the calculator back on the shelf',
  calcDrag: 'Drag the calculator onto the table',
  calcTake: 'Take the calculator from the shelf',
  avg: 'AVG',
  mode: 'MODE',
  calcSwitch: 'Average or mode',
  showingAvg: 'Showing the average; switch to mode',
  showingMode: 'Showing the mode; switch to average',
};

export type Key = keyof typeof en;
type Dictionary = Record<Key, string>;

const zh: Dictionary = {
  title: '计划扑克',
  coinUp: '翻开所有牌',
  coinDown: '盖上所有牌',
  clear: '收回所有牌',
  fwLoad: '装填烟花',
  fwUnload: '卸下烟花',
  card: '{name} 的牌',
  cardDown: '{name} 的暗牌',
  play: '出 {card}',
  takeBack: '收回 {card}',
  changeInitials: '更改你的缩写',
  copyLink: '复制房间链接',
  fullscreen: '全屏',
  reconnecting: '正在重新连接',
  nameInput: '你的姓名缩写或一个表情',
  sit: '入座',
  calcShelve: '把计算器放回架子',
  calcDrag: '把计算器拖到桌上',
  calcTake: '从架子上取下计算器',
  avg: '平均',
  mode: '众数',
  calcSwitch: '平均数或众数',
  showingAvg: '显示平均数；切换到众数',
  showingMode: '显示众数；切换到平均数',
};

const hi: Dictionary = {
  title: 'प्लानिंग पोकर',
  coinUp: 'पत्ते सीधे करें',
  coinDown: 'पत्ते उलटे करें',
  clear: 'पत्ते हटाएँ',
  fwLoad: 'आतिशबाज़ी भरें',
  fwUnload: 'आतिशबाज़ी निकालें',
  card: '{name} का पत्ता',
  cardDown: '{name} का उलटा पत्ता',
  play: '{card} चलें',
  takeBack: '{card} वापस लें',
  changeInitials: 'अपने आद्याक्षर बदलें',
  copyLink: 'कमरे का लिंक कॉपी करें',
  fullscreen: 'पूर्ण स्क्रीन',
  reconnecting: 'फिर से जुड़ रहा है',
  nameInput: 'आपके आद्याक्षर या एक इमोजी',
  sit: 'बैठें',
  calcShelve: 'कैलकुलेटर वापस शेल्फ़ पर रखें',
  calcDrag: 'कैलकुलेटर को मेज़ पर खींचें',
  calcTake: 'शेल्फ़ से कैलकुलेटर उठाएँ',
  avg: 'औसत',
  mode: 'बहुलक',
  calcSwitch: 'औसत या बहुलक',
  showingAvg: 'औसत दिख रहा है; बहुलक पर जाएँ',
  showingMode: 'बहुलक दिख रहा है; औसत पर जाएँ',
};

const es: Dictionary = {
  title: 'Planning Poker',
  coinUp: 'Poner las cartas boca arriba',
  coinDown: 'Poner las cartas boca abajo',
  clear: 'Retirar las cartas',
  fwLoad: 'Cargar los fuegos artificiales',
  fwUnload: 'Descargar los fuegos artificiales',
  card: 'Carta de {name}',
  cardDown: 'Carta boca abajo de {name}',
  play: 'Jugar {card}',
  takeBack: 'Recoger {card}',
  changeInitials: 'Cambiar tus iniciales',
  copyLink: 'Copiar el enlace de la sala',
  fullscreen: 'Pantalla completa',
  reconnecting: 'Reconectando',
  nameInput: 'Tus iniciales o un emoji',
  sit: 'Sentarse',
  calcShelve: 'Devolver la calculadora al estante',
  calcDrag: 'Arrastrar la calculadora a la mesa',
  calcTake: 'Coger la calculadora del estante',
  avg: 'MEDIA',
  mode: 'MODA',
  calcSwitch: 'Media o moda',
  showingAvg: 'Muestra la media; cambiar a la moda',
  showingMode: 'Muestra la moda; cambiar a la media',
};

const ar: Dictionary = {
  title: 'بوكر التخطيط',
  coinUp: 'اكشف الأوراق',
  coinDown: 'أخفِ الأوراق',
  clear: 'اجمع الأوراق',
  fwLoad: 'حمّل الألعاب النارية',
  fwUnload: 'أفرغ الألعاب النارية',
  card: 'ورقة {name}',
  cardDown: 'ورقة {name} المقلوبة',
  play: 'العب {card}',
  takeBack: 'استرجع {card}',
  changeInitials: 'غيّر الأحرف الأولى من اسمك',
  copyLink: 'انسخ رابط الغرفة',
  fullscreen: 'ملء الشاشة',
  reconnecting: 'جارٍ إعادة الاتصال',
  nameInput: 'الأحرف الأولى من اسمك أو رمز تعبيري',
  sit: 'اجلس',
  calcShelve: 'أعد الآلة الحاسبة إلى الرف',
  calcDrag: 'اسحب الآلة الحاسبة إلى الطاولة',
  calcTake: 'خذ الآلة الحاسبة من الرف',
  avg: 'المتوسط',
  mode: 'المنوال',
  calcSwitch: 'المتوسط أو المنوال',
  showingAvg: 'يعرض المتوسط؛ بدّل إلى المنوال',
  showingMode: 'يعرض المنوال؛ بدّل إلى المتوسط',
};

const fr: Dictionary = {
  title: 'Planning Poker',
  coinUp: 'Retourner les cartes face visible',
  coinDown: 'Retourner les cartes face cachée',
  clear: 'Ramasser les cartes',
  fwLoad: 'Charger le feu d’artifice',
  fwUnload: 'Décharger le feu d’artifice',
  card: 'Carte de {name}',
  cardDown: 'Carte face cachée de {name}',
  play: 'Jouer {card}',
  takeBack: 'Reprendre {card}',
  changeInitials: 'Changer vos initiales',
  copyLink: 'Copier le lien du salon',
  fullscreen: 'Plein écran',
  reconnecting: 'Reconnexion',
  nameInput: 'Vos initiales ou un emoji',
  sit: 'S’asseoir',
  calcShelve: 'Remettre la calculatrice sur l’étagère',
  calcDrag: 'Glisser la calculatrice sur la table',
  calcTake: 'Prendre la calculatrice sur l’étagère',
  avg: 'MOY',
  mode: 'MODE',
  calcSwitch: 'Moyenne ou mode',
  showingAvg: 'Affiche la moyenne ; passer au mode',
  showingMode: 'Affiche le mode ; passer à la moyenne',
};

const pt: Dictionary = {
  title: 'Planning Poker',
  coinUp: 'Virar as cartas para cima',
  coinDown: 'Virar as cartas para baixo',
  clear: 'Recolher as cartas',
  fwLoad: 'Carregar os fogos de artifício',
  fwUnload: 'Descarregar os fogos de artifício',
  card: 'Carta de {name}',
  cardDown: 'Carta virada para baixo de {name}',
  play: 'Jogar {card}',
  takeBack: 'Recolher {card}',
  changeInitials: 'Mudar suas iniciais',
  copyLink: 'Copiar o link da sala',
  fullscreen: 'Tela cheia',
  reconnecting: 'Reconectando',
  nameInput: 'Suas iniciais ou um emoji',
  sit: 'Sentar',
  calcShelve: 'Devolver a calculadora à prateleira',
  calcDrag: 'Arrastar a calculadora para a mesa',
  calcTake: 'Pegar a calculadora na prateleira',
  avg: 'MÉDIA',
  mode: 'MODA',
  calcSwitch: 'Média ou moda',
  showingAvg: 'Mostrando a média; mudar para a moda',
  showingMode: 'Mostrando a moda; mudar para a média',
};

const ru: Dictionary = {
  title: 'Планинг-покер',
  coinUp: 'Открыть карты',
  coinDown: 'Перевернуть карты рубашкой вверх',
  clear: 'Убрать карты',
  fwLoad: 'Зарядить фейерверк',
  fwUnload: 'Разрядить фейерверк',
  card: 'Карта {name}',
  cardDown: 'Закрытая карта {name}',
  play: 'Сыграть {card}',
  takeBack: 'Забрать {card}',
  changeInitials: 'Изменить инициалы',
  copyLink: 'Скопировать ссылку на комнату',
  fullscreen: 'Полноэкранный режим',
  reconnecting: 'Переподключение',
  nameInput: 'Ваши инициалы или эмодзи',
  sit: 'Сесть',
  calcShelve: 'Вернуть калькулятор на полку',
  calcDrag: 'Перетащить калькулятор на стол',
  calcTake: 'Взять калькулятор с полки',
  avg: 'СРЕД',
  mode: 'МОДА',
  calcSwitch: 'Среднее или мода',
  showingAvg: 'Показано среднее; переключить на моду',
  showingMode: 'Показана мода; переключить на среднее',
};

const ja: Dictionary = {
  title: 'プランニングポーカー',
  coinUp: 'カードを表にする',
  coinDown: 'カードを裏にする',
  clear: 'カードを片付ける',
  fwLoad: '花火を装填する',
  fwUnload: '花火を外す',
  card: '{name}のカード',
  cardDown: '{name}の伏せたカード',
  play: '{card}を出す',
  takeBack: '{card}を戻す',
  changeInitials: 'イニシャルを変更',
  copyLink: 'ルームのリンクをコピー',
  fullscreen: '全画面表示',
  reconnecting: '再接続中',
  nameInput: 'イニシャルまたは絵文字',
  sit: '着席する',
  calcShelve: '電卓を棚に戻す',
  calcDrag: '電卓をテーブルにドラッグ',
  calcTake: '棚から電卓を取る',
  avg: '平均',
  mode: '最頻',
  calcSwitch: '平均値または最頻値',
  showingAvg: '平均値を表示中。最頻値に切り替え',
  showingMode: '最頻値を表示中。平均値に切り替え',
};

const de: Dictionary = {
  title: 'Planning Poker',
  coinUp: 'Karten aufdecken',
  coinDown: 'Karten verdecken',
  clear: 'Karten einsammeln',
  fwLoad: 'Feuerwerk laden',
  fwUnload: 'Feuerwerk entladen',
  card: 'Karte von {name}',
  cardDown: 'Verdeckte Karte von {name}',
  play: '{card} ausspielen',
  takeBack: '{card} zurücknehmen',
  changeInitials: 'Initialen ändern',
  copyLink: 'Raumlink kopieren',
  fullscreen: 'Vollbild',
  reconnecting: 'Verbindung wird wiederhergestellt',
  nameInput: 'Deine Initialen oder ein Emoji',
  sit: 'Hinsetzen',
  calcShelve: 'Taschenrechner zurück ins Regal stellen',
  calcDrag: 'Taschenrechner auf den Tisch ziehen',
  calcTake: 'Taschenrechner aus dem Regal nehmen',
  avg: 'MITTEL',
  mode: 'MODUS',
  calcSwitch: 'Mittelwert oder Modus',
  showingAvg: 'Zeigt den Mittelwert; zum Modus wechseln',
  showingMode: 'Zeigt den Modus; zum Mittelwert wechseln',
};

export const LANGUAGES = { en, zh, hi, es, ar, fr, pt, ru, ja, de } satisfies Record<string, Dictionary>;
export type Language = keyof typeof LANGUAGES;

/** The first supported language among `?lang=` and then the browser's preferences, matched on the primary subtag. */
export function pickLanguage(query: string | null, preferred: readonly string[]): Language {
  for (const tag of [query, ...preferred]) {
    const base = tag?.toLowerCase().split('-')[0];
    if (base && Object.hasOwn(LANGUAGES, base)) {
      return base as Language;
    }
  }
  return 'en';
}

let current: Dictionary = en;

export function t(key: Key, params: Record<string, string> = {}): string {
  return current[key].replace(/\{(\w+)\}/g, (_, name: string) => params[name] ?? '');
}

/**
 * Sets the language and fills every `data-i18n` (text), `data-i18n-title` and
 * `data-i18n-label` (aria-label) element under `root` from the dictionary.
 */
export function useLanguage(lang: Language, root: Document) {
  current = LANGUAGES[lang];
  root.documentElement.lang = lang;
  root.title = t('title');
  for (const el of root.querySelectorAll<HTMLElement>('[data-i18n]')) {
    el.textContent = t(el.dataset.i18n as Key);
  }
  for (const el of root.querySelectorAll<HTMLElement>('[data-i18n-title]')) {
    el.title = t(el.dataset.i18nTitle as Key);
  }
  for (const el of root.querySelectorAll<HTMLElement>('[data-i18n-label]')) {
    el.setAttribute('aria-label', t(el.dataset.i18nLabel as Key));
  }
}
