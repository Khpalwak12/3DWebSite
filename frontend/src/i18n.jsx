import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'dastarkhwan-lang'

export const LOCALES = [
  { id: 'ps', label: 'پښتو', dir: 'rtl', intl: 'fa-AF', htmlLang: 'ps' },
  { id: 'fa', label: 'دری', dir: 'rtl', intl: 'fa-AF', htmlLang: 'fa-AF' },
  { id: 'en', label: 'EN', dir: 'ltr', intl: 'en', htmlLang: 'en' },
]

const L = (ps, fa, en) => ({ ps, fa, en })

const ui = {
  'meta.title': L('دسترخوان', 'دسترخوان', 'Dastarkhwan'),
  'meta.description': L(
    'دسترخوان، د کابل افغاني رستورانت. مینو وګورئ او میز ونیسئ.',
    'دسترخوان، رستورانت افغانی در کابل. مینو را ببینید و میز بگیرید.',
    'Dastarkhwan, an Afghan restaurant in Kabul. See the menu and reserve a table.',
  ),
  language: L('ژبه', 'زبان', 'Language'),
  currency: L('افغانۍ', 'افغانی', 'AFN'),
  'table.name': L('میز {n}', 'میز {n}', 'Table {n}'),
  'table.seats': L('{n} کسان', '{n} نفر', '{n} guests'),
  'spice.0': L('ملایم', 'ملایم', 'Mild'),
  'spice.1': L('لږ توند', 'کمی تند', 'A little hot'),
  'spice.2': L('توند', 'تند', 'Hot'),
  'spice.3': L('ډېر توند', 'خیلی تند', 'Very hot'),
  'hours.week': L('شنبه تر پنجشنبې', 'شنبه تا پنجشنبه', 'Saturday–Thursday'),
  'hours.friday': L('جمعه', 'جمعه', 'Friday'),
  'nav.home': L('کور', 'خانه', 'Home'),
  'nav.menu': L('مینو', 'مینو', 'Menu'),
  'nav.story': L('زموږ کیسه', 'داستان ما', 'Our story'),
  'nav.reserve': L('میز ونیسئ', 'میز بگیرید', 'Reserve'),
  'nav.open': L('مینو پرانیزئ', 'مینو را باز کنید', 'Open menu'),
  'nav.close': L('مینو وتړئ', 'مینو را ببندید', 'Close menu'),
  'footer.address': L('پته', 'آدرس', 'Address'),
  'footer.hours': L('ساعتونه', 'ساعت‌ها', 'Hours'),
  'footer.pages': L('پاڼې', 'صفحه‌ها', 'Pages'),
  'footer.reserve': L('ځای نیول', 'گرفتن میز', 'Reserve'),
  'home.eyebrow': L('افغاني رستورانت · {city}', 'رستورانت افغانی · {city}', 'Afghan restaurant · {city}'),
  'home.menu': L('مینو وګورئ', 'مینو را ببینید', 'See the menu'),
  'home.reserve': L('میز ونیسئ', 'میز بگیرید', 'Reserve a table'),
  'home.drag': L('د صحنې د څرخولو لپاره یې وښکئ', 'برای چرخاندن صحنه آن را بکشید', 'Drag to turn the table'),
  'home.tonight': L('د نن شپه', 'امشب', 'Tonight'),
  'home.tonightTitle': L('هغه خوندونه چې میلمانه یې بیا راولي', 'مزه‌هایی که مهمان را دوباره می‌آورد', 'The dishes that bring guests back'),
  'home.menuLoading': L('مینو راځي…', 'مینو می‌آید…', 'The menu is on its way…'),
  'home.menuError': L('مینو رانغی. Laravel سرور وګورئ.', 'مینو نیامد. سرور را چک کنید.', 'The menu did not load. Check the server.'),
  'home.allMenu': L('ټول مینو', 'تمام مینو', 'Full menu'),
  'home.kitchenError': L('له پخلنځي سره اړیکه ونه نیول شوه.', 'با آشپزخانه ارتباط گرفته نشد.', 'The kitchen could not be reached.'),
  'home.readStory': L('کیسه ولولئ', 'داستان را بخوانید', 'Read the story'),
  'home.visit': L('راتلل', 'آمدن', 'Visit'),
  'home.visitTitle': L('کارته ۴، کله چې وږي شئ', 'کارته ۴، هر وقت گرسنه شدید', 'Kart-e 4, whenever you are hungry'),
  'home.freeTable': L('خالي میز وګورئ', 'میز خالی را ببینید', 'See a free table'),
  'menu.title': L('له تنوره تر زعفرانو', 'از تنور تا زعفران', 'From the tandoor to the saffron'),
  'menu.intro': L(
    'بیې په افغانیو دي. توندوالی د مسالو اندازه ښيي، که غواړئ ملایم یې ووایاست.',
    'قیمت‌ها به افغانی است. تندی اندازه مصالحه را نشان می‌دهد؛ اگر ملایم می‌خواهید، بگویید.',
    'Prices are in Afghanis. Heat shows the spice. Ask if you want it mild.',
  ),
  'menu.loading': L('مینو راځي…', 'مینو می‌آید…', 'The menu is on its way…'),
  'menu.error': L('مینو رانغی. backend سرور چالان کړئ.', 'مینو نیامد. سرور را روشن کنید.', 'The menu did not load. Start the server.'),
  'menu.all': L('ټول', 'همه', 'All'),
  'menu.reserve': L('میز ونیسئ', 'میز بگیرید', 'Reserve a table'),
  'menu.close': L('وتړئ', 'ببندید', 'Close'),
  'about.loading': L('کیسه راځي…', 'داستان می‌آید…', 'The story is on its way…'),
  'about.error': L('د رستورانت معلومات رانغلل.', 'معلومات رستورانت نیامد.', 'The restaurant details did not load.'),
  'about.floor': L('فرش', 'فرش', 'Floor'),
  'about.floorText': L(
    'یوه خونه د کور په ډول ده: توشک، دسترخوان، او ډوډۍ پر ځمکه.',
    'یک اتاق مانند خانه است: توشک، دسترخوان، و نان بر زمین.',
    'One room is like home: toshaks, a dastarkhwan, and the meal on the ground.',
  ),
  'about.salon': L('سالون', 'سالون', 'Salon'),
  'about.salonText': L(
    'که میز غواړئ، اته میزونه دي. له دوه کسانو څخه تر شپږو پورې.',
    'اگر میز می‌خواهید، هشت میز است. از دو نفر تا شش نفر.',
    'If you want a table, there are eight, for two to six guests.',
  ),
  'about.kitchen': L('پخلنځی', 'آشپزخانه', 'Kitchen'),
  'about.kitchenText': L(
    'وریجې زعفراني، کباب پر سکرو، او نان هماغه ورځ له تنوره.',
    'برنج زعفرانی، کباب روی زغال، و نان همان روز از تنور.',
    'Saffron rice, charcoal kebab, and bread baked the same day.',
  ),
  'reserve.eyebrow': L('ځای نیول', 'گرفتن میز', 'Reserve'),
  'reserve.title': L('په سالون کې میز وټاکئ', 'در سالون میز انتخاب کنید', 'Choose a table in the salon'),
  'reserve.intro': L(
    'هره ناسته نږدې یو نیم ساعت وخت نیسي. زرین میز خالي دی، تور سور نیول شوی، او خړ میز د دومره کسانو لپاره کوچنی دی.',
    'هر نشستن نزدیک یک و نیم ساعت وقت می‌گیرد. میز زرین خالی است، سرخ تیره گرفته شده، و میز خاکستری برای این شمار نفر کوچک است.',
    'Each seating is about an hour and a half. Gold is free, dark red is taken, and grey is too small for the party.',
  ),
  'reserve.date': L('نېټه', 'تاریخ', 'Date'),
  'reserve.time': L('وخت', 'وقت', 'Time'),
  'reserve.guests': L('کسان', 'نفر', 'Guests'),
  'reserve.checking': L('میزونه کتل کېږي…', 'میزها دیده می‌شود…', 'Checking tables…'),
  'reserve.listError': L('د میزونو لیست رانغی.', 'فهرست میزها نیامد.', 'The table list did not load.'),
  'reserve.open': L('{n} میزونه خالي دي.', '{n} میز خالی است.', '{n} tables are free.'),
  'reserve.none': L(
    'په دې وخت کې د دومره کسانو لپاره خالي میز نشته.',
    'در این وقت برای این شمار نفر میز خالی نیست.',
    'No free table fits this many guests at this time.',
  ),
  'reserve.selected': L(' ټاکل شوی: {name}.', ' انتخاب شده: {name}.', ' Selected: {name}.'),
  'reserve.pickTable': L('له سالون څخه یو خالي میز وټاکئ.', 'از سالون یک میز خالی انتخاب کنید.', 'Choose a free table in the salon.'),
  'reserve.name': L('نوم', 'نام', 'Name'),
  'reserve.phone': L('تلیفون', 'تلفن', 'Phone'),
  'reserve.note': L('یادښت', 'یادداشت', 'Note'),
  'reserve.notePlaceholder': L(
    'د بېلګې په توګه: د کړکۍ څنګ، یا د ماشوم چوکۍ',
    'مثلاً: کنار کلکین، یا چوکی کودک',
    'For example: by the window, or a child’s chair',
  ),
  'reserve.submitting': L('ثبتېږي…', 'ثبت می‌شود…', 'Saving…'),
  'reserve.submit': L('میز ثبت کړئ', 'میز را ثبت کنید', 'Book the table'),
  'reserve.free': L('خالي', 'خالی', 'Free'),
  'reserve.taken': L('نیول شوی', 'گرفته شده', 'Taken'),
  'reserve.small': L('کوچنی', 'کوچک', 'Too small'),
  'reserve.yours': L('ستاسو میز', 'میز شما', 'Your table'),
  'reserve.booked': L('ثبت شو', 'ثبت شد', 'Booked'),
  'reserve.ready': L('ستاسو دسترخوان برابرېږي', 'دسترخوان شما آماده می‌شود', 'Your table is being set'),
  'reserve.held': L(
    '{name}، {table} د {guests} کسانو لپاره {when} نیول شوی دی.',
    '{name}، {table} برای {guests} نفر در {when} گرفته شده است.',
    '{name}, {table} is held for {guests} guests on {when}.',
  ),
  'reserve.confirmLead': L('موږ به پر ', 'تایید را به ', 'We will confirm on '),
  'reserve.confirmTail': L(' تایید درکړو. شمېره یې {id} ده.', ' می‌فرستیم. شماره آن {id} است.', '. The reference is {id}.'),
  'reserve.another': L('بل ځای ونیسئ', 'یک وقت دیگر بگیرید', 'Book another table'),
  'error.network': L('له سرور سره اړیکه ونه نیول شوه.', 'با سرور ارتباط گرفته نشد.', 'The server could not be reached.'),
}

const copy = {
  ps: {
    brand: 'دسترخوان',
    tagline: 'د کابل خوند، پر یوه دسترخوان',
    heroNote: 'زعفراني وریجې، د سکرو کباب، او هغه چای چې خبرې اوږدوي.',
    about: 'دسترخوان د کابل یو افغاني رستورانت دی. دلته هغه خواړه پخیږي چې د کور له پخلنځي څخه راغلې دي: وریجې په زعفرانو، کباب پر سکرو، او نان له تنوره.\n\nیوه خونه یې د فرش دسترخوان دی، پر توشکو ناست. بله خونه سالون دی، که میز غواړئ. دواړه ځایونه د یوه خوند لپاره دي: چې ډوډۍ په بیړه خلاصه نشي.',
    address: 'کارته ۴، څلورمه کوڅه',
    city: 'کابل',
  },
  fa: {
    brand: 'دسترخوان',
    tagline: 'مزه کابل، بر یک دسترخوان',
    heroNote: 'برنج زعفرانی، کباب زغالی، و آن چای که گپ را دراز می‌کند.',
    about: 'دسترخوان یک رستورانت افغانی در کابل است. اینجا همان غذاهایی پخته می‌شود که از آشپزخانه خانه آمده: برنج با زعفران، کباب روی زغال، و نان از تنور.\n\nیک اتاق دسترخوان فرش است، نشسته بر توشک. اتاق دیگر سالون است، اگر میز بخواهید. هر دو جا برای یک مزه است: که نان با عجله تمام نشود.',
    address: 'کارته ۴، کوچه چهارم',
    city: 'کابل',
  },
  en: {
    brand: 'Dastarkhwan',
    tagline: 'The taste of Kabul, on one dastarkhwan',
    heroNote: 'Saffron rice, charcoal kebab, and the tea that keeps the conversation going.',
    about: 'Dastarkhwan is an Afghan restaurant in Kabul. The kitchen cooks what comes from a home kitchen: rice with saffron, kebab over charcoal, and bread from the tandoor.\n\nOne room is a floor dastarkhwan, seated on toshaks. The other is the salon, if you want a table. Both are for the same pleasure: a meal that is not rushed.',
    address: 'Kart-e 4, 4th Street',
    city: 'Kabul',
  },
}

const categories = {
  rice: {
    name: L('وریجې', 'برنج', 'Rice'),
    description: L('زعفراني پلو او چلو', 'پلو و چلوی زعفرانی', 'Saffron palaw and chalau'),
  },
  kebab: {
    name: L('کبابونه', 'کباب', 'Kebabs'),
    description: L('پر سکرو پخه شوي', 'پخته شده روی زغال', 'Grilled over charcoal'),
  },
  bread: {
    name: L('ډوډۍ او اشتها', 'نان و اشتها', 'Bread and starters'),
    description: L('له تنوره او د پیل ډوډۍ', 'نان تنوری و غذای آغاز', 'Tandoor bread and first plates'),
  },
  stew: {
    name: L('قورمې', 'قورمه', 'Stews'),
    description: L('ورو پخه شوي خوړن', 'غذاهای آرام‌پز', 'Slow-cooked dishes'),
  },
  drinks: {
    name: L('څښاک', 'نوشیدنی', 'Drinks'),
    description: L('چای، قیماق او دوغ', 'چای، قیماق و دوغ', 'Tea, qaimaq and doogh'),
  },
  dessert: {
    name: L('خواږه', 'شیرینی', 'Sweets'),
    description: L('د ډوډۍ وروسته', 'پس از غذا', 'After the meal'),
  },
}

const dishes = {
  qabili: {
    name: L('قابلي پلو', 'قابلی پلو', 'Qabili Palaw'),
    description: L(
      'زعفراني وریجې، د زردکو او ممیزو سره، او د پسه غوښې ټوټه.',
      'برنج زعفرانی، با زردک و کشمش، و یک تکه گوشت گوسفند.',
      'Saffron rice with carrots and raisins, and a piece of lamb.',
    ),
  },
  kofta: {
    name: L('کوفته چلو', 'کوفته چلو', 'Kofta Chalau'),
    description: L(
      'د غوښې کوفته په قورمه کې، له سپینو وریجو سره.',
      'کوفته گوشت در قورمه، با برنج سفید.',
      'Meat kofta in sauce, with plain rice.',
    ),
  },
  'chicken-tikka': {
    name: L('چکن تکہ', 'چکن تکه', 'Chicken Tikka'),
    description: L(
      'د سینې ټوټې په زعفرانو او مسالو کې، د سکرو کباب.',
      'تکه سینه در زعفران و مصالحه، کباب زغالی.',
      'Saffron-spiced chicken, grilled over charcoal.',
    ),
  },
  seekh: {
    name: L('سیخ کباب', 'سیخ کباب', 'Seekh Kebab'),
    description: L(
      'د پسه قیمه پر سیخ، د سکرو له لوګي سره.',
      'قیمه گوسفند بر سیخ، با دود زغال.',
      'Minced lamb on a skewer, with the smoke of the coals.',
    ),
  },
  chapli: {
    name: L('چاپلي کباب', 'چاپلی کباب', 'Chapli Kebab'),
    description: L(
      'پخه قیمه، د کابل په مسالو، له نان سره.',
      'قیمه پخته، با مصالحه کابل، همراه نان.',
      'A flat spiced patty, Kabul style, with naan.',
    ),
  },
  bolani: {
    name: L('بولاني', 'بولانی', 'Bolani'),
    description: L(
      'نرۍ ډوډۍ د کچالو له ډکون سره، سره زرین پخه شوې.',
      'نان نازک با درون کچالو، سرخ و زرین پخته شده.',
      'A thin flatbread filled with potato, fried until golden.',
    ),
  },
  nan: {
    name: L('افغاني نان', 'نان افغانی', 'Afghan Naan'),
    description: L('د تنور تازه نان.', 'نان تازه تنور.', 'Fresh tandoor naan.'),
  },
  roghani: {
    name: L('روغاني نان', 'روغنی نان', 'Roghani Naan'),
    description: L(
      'په غوړیو غوړه شوې نان، له کنجدو سره.',
      'نان سرخ شده در روغن، با کنجد.',
      'Naan fried in oil, with sesame.',
    ),
  },
  mantu: {
    name: L('منتو', 'منتو', 'Mantu'),
    description: L(
      'د غوښې ډمپلینګ، پر سر یې مستې او د دال ساس.',
      'دمپلینگ گوشت، با ماست و سس دال.',
      'Steamed meat dumplings, with yogurt and lentil sauce.',
    ),
  },
  aush: {
    name: L('آش', 'آش', 'Aush'),
    description: L(
      'د رشتو او نخودو ښوروا، پر سر یې مستې او نعناع.',
      'شوربای رشته و نخود، با ماست و نعناع.',
      'Noodle and chickpea soup, finished with yogurt and mint.',
    ),
  },
  shorwa: {
    name: L('شوروا', 'شوروا', 'Shorwa'),
    description: L(
      'د غوښې رڼه ښوروا، له تنوري نان سره.',
      'شوربای رقیق گوشت، با نان تنوری.',
      'A clear meat broth, with tandoor naan.',
    ),
  },
  qorma: {
    name: L('قرمه', 'قورمه', 'Qorma'),
    description: L(
      'د پسه غوښه په پیازو او مسالو کې ورو پخه شوې.',
      'گوشت گوسفند با پیاز و مصالحه، آرام پخته شده.',
      'Lamb cooked slowly with onion and spice.',
    ),
  },
  bamya: {
    name: L('بامیه', 'بامیه', 'Bamya'),
    description: L(
      'بامیه له غوښې سره، د نان لپاره.',
      'بامیه با گوشت، برای نان.',
      'Okra with meat, for scooping with naan.',
    ),
  },
  'green-tea': {
    name: L('شین چای', 'چای سبز', 'Green Tea'),
    description: L('په کیتلي کې، له الهېلې سره.', 'در کتری، با هل.', 'Served in a pot, with cardamom.'),
  },
  'qaimaq-tea': {
    name: L('قیماق چای', 'قیماق چای', 'Qaimaq Tea'),
    description: L('توره چای له قیماقه سره.', 'چای سیاه با قیماق.', 'Black tea with a layer of clotted cream.'),
  },
  doogh: {
    name: L('دوغ', 'دوغ', 'Doogh'),
    description: L('د مستو یخ څښاک، په نعناع.', 'نوشیدنی سرد ماست، با نعناع.', 'A cold yogurt drink, with mint.'),
  },
  firni: {
    name: L('فیرني', 'فیرنی', 'Firni'),
    description: L('د شیدو خوږه، په ګلاب او پسته.', 'شیرینی شیر، با گلاب و پسته.', 'A milk pudding, with rose and pistachio.'),
  },
  baklava: {
    name: L('باقلوا', 'باقلوا', 'Baklava'),
    description: L(
      'د غوړو پاڼو خوږه، په پسته او عسل.',
      'شیرینی برگه‌های روغنی، با پسته و عسل.',
      'Layered pastry with pistachio and honey.',
    ),
  },
}

const BAND = ['qabili', 'mantu', 'chicken-tikka', 'bolani', 'firni', 'green-tea']

const HOURS = [
  { key: 'hours.week', time: '12:00 – 22:30' },
  { key: 'hours.friday', time: '13:00 – 23:00' },
]

function pick(pack, lang) {
  return pack?.[lang] || pack?.ps || ''
}

function fill(template, vars) {
  return Object.entries(vars).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value ?? ''),
    template,
  )
}

function readLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (LOCALES.some((locale) => locale.id === saved)) return saved
  } catch {
    /* storage can be blocked */
  }
  return 'ps'
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readLang)

  const setLang = useCallback((next) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(() => {
    const locale = LOCALES.find((item) => item.id === lang) || LOCALES[0]
    const t = (key, vars) => fill(pick(ui[key], lang), vars || {})
    const formatNumber = (amount) => new Intl.NumberFormat(locale.intl, {
      numberingSystem: lang === 'en' ? 'latn' : 'arabext',
    }).format(amount)
    const digits = (text) => String(text).replace(/\d/g, (digit) => formatNumber(Number(digit)))
    const tableLabel = (label) => {
      const eastern = '۰۱۲۳۴۵۶۷۸۹'
      const normalized = [...String(label)].map((char) => {
        const index = eastern.indexOf(char)
        return index >= 0 ? String(index) : char
      }).join('')
      const match = normalized.match(/\d+/)
      return match ? t('table.name', { n: formatNumber(Number(match[0])) }) : label
    }

    return {
      lang,
      setLang,
      dir: locale.dir,
      locales: LOCALES,
      t,
      formatNumber,
      money: (amount) => `${formatNumber(amount)} ${t('currency')}`,
      formatWhen: (value) => new Intl.DateTimeFormat(locale.intl, {
        calendar: 'gregory',
        numberingSystem: lang === 'en' ? 'latn' : 'arabext',
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(String(value).replace(' ', 'T'))),
      item: (dish) => ({
        ...dish,
        name: pick(dishes[dish.slug]?.name, lang) || dish.name,
        description: pick(dishes[dish.slug]?.description, lang) || dish.description,
        category: pick(categories[dish.category_slug]?.name, lang) || dish.category,
      }),
      category: (group) => ({
        ...group,
        name: pick(categories[group.slug]?.name, lang) || group.name,
        description: pick(categories[group.slug]?.description, lang) || group.description,
        items: (group.items || []).map((dish) => ({
          ...dish,
          category_slug: group.slug,
          name: pick(dishes[dish.slug]?.name, lang) || dish.name,
          description: pick(dishes[dish.slug]?.description, lang) || dish.description,
          category: pick(categories[group.slug]?.name, lang) || dish.category,
        })),
      }),
      dishName: (slug) => pick(dishes[slug]?.name, lang),
      band: BAND.map((slug) => pick(dishes[slug]?.name, lang)).join(' · '),
      place: {
        ...copy[lang],
        line: `${copy[lang].address}${lang === 'en' ? ', ' : '، '}${copy[lang].city}`,
      },
      hours: HOURS.map((row) => ({ days: t(row.key), time: digits(row.time) })),
      spice: (level) => t(`spice.${level || 0}`),
      tableLabel,
      seatsLabel: (count) => t('table.seats', { n: formatNumber(count) }),
    }
  }, [lang, setLang])

  useEffect(() => {
    const locale = LOCALES.find((item) => item.id === lang) || LOCALES[0]
    document.documentElement.lang = locale.htmlLang
    document.documentElement.dir = locale.dir
    document.title = pick(ui['meta.title'], lang)
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', pick(ui['meta.description'], lang))
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useI18n() {
  return useContext(LanguageContext)
}
