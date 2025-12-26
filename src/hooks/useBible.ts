import { useState, useEffect, useMemo } from 'react';
import { 
  parseBibleText, 
  getBookChapters, 
  getChapterVerses,
  BibleData, 
  Book, 
  Verse 
} from '@/lib/bibleParser';

// Sample KJV data - First few chapters of Genesis for the prototype
const SAMPLE_KJV_DATA = `GEN = Genesis
GEN 1:1 In the beginning God created the heaven and the earth.
GEN 1:2 And the earth was without form, and void; and darkness [was] upon the face of the deep. And the Spirit of God moved upon the face of the waters.
GEN 1:3 And God said, Let there be light: and there was light.
GEN 1:4 And God saw the light, that [it was] good: and God divided the light from the darkness.
GEN 1:5 And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.
GEN 1:6 And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.
GEN 1:7 And God made the firmament, and divided the waters which [were] under the firmament from the waters which [were] above the firmament: and it was so.
GEN 1:8 And God called the firmament Heaven. And the evening and the morning were the second day.
GEN 1:9 And God said, Let the waters under the heaven be gathered together unto one place, and let the dry [land] appear: and it was so.
GEN 1:10 And God called the dry [land] Earth; and the gathering together of the waters called he Seas: and God saw that [it was] good.
GEN 1:11 And God said, Let the earth bring forth grass, the herb yielding seed, [and] the fruit tree yielding fruit after his kind, whose seed [is] in itself, upon the earth: and it was so.
GEN 1:12 And the earth brought forth grass, [and] herb yielding seed after his kind, and the tree yielding fruit, whose seed [was] in itself, after his kind: and God saw that [it was] good.
GEN 1:13 And the evening and the morning were the third day.
GEN 1:14 And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:
GEN 1:15 And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so.
GEN 1:16 And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: [he made] the stars also.
GEN 1:17 And God set them in the firmament of the heaven to give light upon the earth,
GEN 1:18 And to rule over the day and over the night, and to divide the light from the darkness: and God saw that [it was] good.
GEN 1:19 And the evening and the morning were the fourth day.
GEN 1:20 And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl [that] may fly above the earth in the open firmament of heaven.
GEN 1:21 And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that [it was] good.
GEN 1:22 And God blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth.
GEN 1:23 And the evening and the morning were the fifth day.
GEN 1:24 And God said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so.
GEN 1:25 And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that [it was] good.
GEN 1:26 And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.
GEN 1:27 So God created man in his [own] image, in the image of God created he him; male and female created he them.
GEN 1:28 And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth.
GEN 1:29 And God said, Behold, I have given you every herb bearing seed, which [is] upon the face of all the earth, and every tree, in the which [is] the fruit of a tree yielding seed; to you it shall be for meat.
GEN 1:30 And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein [there is] life, [I have given] every green herb for meat: and it was so.
GEN 1:31 And God saw every thing that he had made, and, behold, [it was] very good. And the evening and the morning were the sixth day.
GEN 2:1 Thus the heavens and the earth were finished, and all the host of them.
GEN 2:2 And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.
GEN 2:3 And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made.
GEN 2:4 These [are] the generations of the heavens and of the earth when they were created, in the day that the LORD God made the earth and the heavens,
GEN 2:5 And every plant of the field before it was in the earth, and every herb of the field before it grew: for the LORD God had not caused it to rain upon the earth, and [there was] not a man to till the ground.
GEN 2:6 But there went up a mist from the earth, and watered the whole face of the ground.
GEN 2:7 And the LORD God formed man [of] the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul.
GEN 2:8 And the LORD God planted a garden eastward in Eden; and there he put the man whom he had formed.
GEN 2:9 And out of the ground made the LORD God to grow every tree that is pleasant to the sight, and good for food; the tree of life also in the midst of the garden, and the tree of knowledge of good and evil.
GEN 2:10 And a river went out of Eden to water the garden; and from thence it was parted, and became into four heads.
GEN 2:11 The name of the first [is] Pison: that [is] it which compasseth the whole land of Havilah, where [there is] gold;
GEN 2:12 And the gold of that land [is] good: there [is] bdellium and the onyx stone.
GEN 2:13 And the name of the second river [is] Gihon: the same [is] it that compasseth the whole land of Ethiopia.
GEN 2:14 And the name of the third river [is] Hiddekel: that [is] it which goeth toward the east of Assyria. And the fourth river [is] Euphrates.
GEN 2:15 And the LORD God took the man, and put him into the garden of Eden to dress it and to keep it.
GEN 2:16 And the LORD God commanded the man, saying, Of every tree of the garden thou mayest freely eat:
GEN 2:17 But of the tree of the knowledge of good and evil, thou shalt not eat of it: for in the day that thou eatest thereof thou shalt surely die.
GEN 2:18 And the LORD God said, [It is] not good that the man should be alone; I will make him an help meet for him.
GEN 2:19 And out of the ground the LORD God formed every beast of the field, and every fowl of the air; and brought [them] unto Adam to see what he would call them: and whatsoever Adam called every living creature, that [was] the name thereof.
GEN 2:20 And Adam gave names to all cattle, and to the fowl of the air, and to every beast of the field; but for Adam there was not found an help meet for him.
GEN 2:21 And the LORD God caused a deep sleep to fall upon Adam, and he slept: and he took one of his ribs, and closed up the flesh instead thereof;
GEN 2:22 And the rib, which the LORD God had taken from man, made he a woman, and brought her unto the man.
GEN 2:23 And Adam said, This [is] now bone of my bones, and flesh of my flesh: she shall be called Woman, because she was taken out of Man.
GEN 2:24 Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh.
GEN 2:25 And they were both naked, the man and his wife, and were not ashamed.
GEN 3:1 Now the serpent was more subtil than any beast of the field which the LORD God had made. And he said unto the woman, Yea, hath God said, Ye shall not eat of every tree of the garden?
GEN 3:2 And the woman said unto the serpent, We may eat of the fruit of the trees of the garden:
GEN 3:3 But of the fruit of the tree which [is] in the midst of the garden, God hath said, Ye shall not eat of it, neither shall ye touch it, lest ye die.
GEN 3:4 And the serpent said unto the woman, Ye shall not surely die:
GEN 3:5 For God doth know that in the day ye eat thereof, then your eyes shall be opened, and ye shall be as gods, knowing good and evil.
GEN 3:6 And when the woman saw that the tree [was] good for food, and that it [was] pleasant to the eyes, and a tree to be desired to make [one] wise, she took of the fruit thereof, and did eat, and gave also unto her husband with her; and he did eat.
GEN 3:7 And the eyes of them both were opened, and they knew that they [were] naked; and they sewed fig leaves together, and made themselves aprons.
GEN 3:8 And they heard the voice of the LORD God walking in the garden in the cool of the day: and Adam and his wife hid themselves from the presence of the LORD God amongst the trees of the garden.
GEN 3:9 And the LORD God called unto Adam, and said unto him, Where [art] thou?
GEN 3:10 And he said, I heard thy voice in the garden, and I was afraid, because I [was] naked; and I hid myself.
GEN 3:11 And he said, Who told thee that thou [wast] naked? Hast thou eaten of the tree, whereof I commanded thee that thou shouldest not eat?
GEN 3:12 And the man said, The woman whom thou gavest [to be] with me, she gave me of the tree, and I did eat.
GEN 3:13 And the LORD God said unto the woman, What [is] this [that] thou hast done? And the woman said, The serpent beguiled me, and I did eat.
GEN 3:14 And the LORD God said unto the serpent, Because thou hast done this, thou [art] cursed above all cattle, and above every beast of the field; upon thy belly shalt thou go, and dust shalt thou eat all the days of thy life:
GEN 3:15 And I will put enmity between thee and the woman, and between thy seed and her seed; it shall bruise thy head, and thou shalt bruise his heel.
GEN 3:16 Unto the woman he said, I will greatly multiply thy sorrow and thy conception; in sorrow thou shalt bring forth children; and thy desire [shall be] to thy husband, and he shall rule over thee.
GEN 3:17 And unto Adam he said, Because thou hast hearkened unto the voice of thy wife, and hast eaten of the tree, of which I commanded thee, saying, Thou shalt not eat of it: cursed [is] the ground for thy sake; in sorrow shalt thou eat [of] it all the days of thy life;
GEN 3:18 Thorns also and thistles shall it bring forth to thee; and thou shalt eat the herb of the field;
GEN 3:19 In the sweat of thy face shalt thou eat bread, till thou return unto the ground; for out of it wast thou taken: for dust thou [art], and unto dust shalt thou return.
GEN 3:20 And Adam called his wife's name Eve; because she was the mother of all living.
GEN 3:21 Unto Adam also and to his wife did the LORD God make coats of skins, and clothed them.
GEN 3:22 And the LORD God said, Behold, the man is become as one of us, to know good and evil: and now, lest he put forth his hand, and take also of the tree of life, and eat, and live for ever:
GEN 3:23 Therefore the LORD God sent him forth from the garden of Eden, to till the ground from whence he was taken.
GEN 3:24 So he drove out the man; and he placed at the east of the garden of Eden Cherubims, and a flaming sword which turned every way, to keep the way of the tree of life.
GEN 4:1 And Adam knew Eve his wife; and she conceived, and bare Cain, and said, I have gotten a man from the LORD.
GEN 4:2 And she again bare his brother Abel. And Abel was a keeper of sheep, but Cain was a tiller of the ground.
GEN 4:3 And in process of time it came to pass, that Cain brought of the fruit of the ground an offering unto the LORD.
GEN 4:4 And Abel, he also brought of the firstlings of his flock and of the fat thereof. And the LORD had respect unto Abel and to his offering:
GEN 4:5 But unto Cain and to his offering he had not respect. And Cain was very wroth, and his countenance fell.
GEN 4:6 And the LORD said unto Cain, Why art thou wroth? and why is thy countenance fallen?
GEN 4:7 If thou doest well, shalt thou not be accepted? and if thou doest not well, sin lieth at the door. And unto thee [shall be] his desire, and thou shalt rule over him.
GEN 4:8 And Cain talked with Abel his brother: and it came to pass, when they were in the field, that Cain rose up against Abel his brother, and slew him.
GEN 4:9 And the LORD said unto Cain, Where [is] Abel thy brother? And he said, I know not: [Am] I my brother's keeper?
GEN 4:10 And he said, What hast thou done? the voice of thy brother's blood crieth unto me from the ground.
GEN 5:1 This [is] the book of the generations of Adam. In the day that God created man, in the likeness of God made he him;
GEN 5:2 Male and female created he them; and blessed them, and called their name Adam, in the day when they were created.
GEN 5:3 And Adam lived an hundred and thirty years, and begat [a son] in his own likeness, after his image; and called his name Seth:
GEN 6:1 And it came to pass, when men began to multiply on the face of the earth, and daughters were born unto them,
GEN 6:2 That the sons of God saw the daughters of men that they [were] fair; and they took them wives of all which they chose.
GEN 6:3 And the LORD said, My spirit shall not always strive with man, for that he also [is] flesh: yet his days shall be an hundred and twenty years.
GEN 6:4 There were giants in the earth in those days; and also after that, when the sons of God came in unto the daughters of men, and they bare [children] to them, the same [became] mighty men which [were] of old, men of renown.
GEN 6:5 And GOD saw that the wickedness of man [was] great in the earth, and [that] every imagination of the thoughts of his heart [was] only evil continually.
GEN 6:6 And it repented the LORD that he had made man on the earth, and it grieved him at his heart.
GEN 6:7 And the LORD said, I will destroy man whom I have created from the face of the earth; both man, and beast, and the creeping thing, and the fowls of the air; for it repenteth me that I have made them.
GEN 6:8 But Noah found grace in the eyes of the LORD.
GEN 6:9 These [are] the generations of Noah: Noah was a just man [and] perfect in his generations, [and] Noah walked with God.
GEN 6:10 And Noah begat three sons, Shem, Ham, and Japheth.
GEN 6:11 The earth also was corrupt before God, and the earth was filled with violence.
GEN 6:12 And God looked upon the earth, and, behold, it was corrupt; for all flesh had corrupted his way upon the earth.
GEN 6:13 And God said unto Noah, The end of all flesh is come before me; for the earth is filled with violence through them; and, behold, I will destroy them with the earth.
GEN 6:14 Make thee an ark of gopher wood; rooms shalt thou make in the ark, and shalt pitch it within and without with pitch.
GEN 6:15 And this [is the fashion] which thou shalt make it [of]: The length of the ark [shall be] three hundred cubits, the breadth of it fifty cubits, and the height of it thirty cubits.
GEN 6:16 A window shalt thou make to the ark, and in a cubit shalt thou finish it above; and the door of the ark shalt thou set in the side thereof; [with] lower, second, and third [stories] shalt thou make it.
GEN 6:17 And, behold, I, even I, do bring a flood of waters upon the earth, to destroy all flesh, wherein [is] the breath of life, from under heaven; [and] every thing that [is] in the earth shall die.
GEN 6:18 But with thee will I establish my covenant; and thou shalt come into the ark, thou, and thy sons, and thy wife, and thy sons' wives with thee.
GEN 6:19 And of every living thing of all flesh, two of every [sort] shalt thou bring into the ark, to keep [them] alive with thee; they shall be male and female.
GEN 6:20 Of fowls after their kind, and of cattle after their kind, of every creeping thing of the earth after his kind, two of every [sort] shall come unto thee, to keep [them] alive.
GEN 6:21 And take thou unto thee of all food that is eaten, and thou shalt gather [it] to thee; and it shall be for food for thee, and for them.
GEN 6:22 Thus did Noah; according to all that God commanded him, so did he.
EXO 1:1 Now these [are] the names of the children of Israel, which came into Egypt; every man and his household came with Jacob.
EXO 1:2 Reuben, Simeon, Levi, and Judah,
EXO 1:3 Issachar, Zebulun, and Benjamin,
EXO 1:4 Dan, and Naphtali, Gad, and Asher.
EXO 1:5 And all the souls that came out of the loins of Jacob were seventy souls: for Joseph was in Egypt [already].
EXO 1:6 And Joseph died, and all his brethren, and all that generation.
EXO 1:7 And the children of Israel were fruitful, and increased abundantly, and multiplied, and waxed exceeding mighty; and the land was filled with them.
EXO 1:8 Now there arose up a new king over Egypt, which knew not Joseph.
EXO 1:9 And he said unto his people, Behold, the people of the children of Israel [are] more and mightier than we:
EXO 1:10 Come on, let us deal wisely with them; lest they multiply, and it come to pass, that, when there falleth out any war, they join also unto our enemies, and fight against us, and [so] get them up out of the land.
EXO 2:1 And there went a man of the house of Levi, and took [to wife] a daughter of Levi.
EXO 2:2 And the woman conceived, and bare a son: and when she saw him that he [was a] goodly [child], she hid him three months.
EXO 2:3 And when she could not longer hide him, she took for him an ark of bulrushes, and daubed it with slime and with pitch, and put the child therein; and she laid [it] in the flags by the river's brink.
LEV 1:1 And the LORD called unto Moses, and spake unto him out of the tabernacle of the congregation, saying,
LEV 1:2 Speak unto the children of Israel, and say unto them, If any man of you bring an offering unto the LORD, ye shall bring your offering of the cattle, [even] of the herd, and of the flock.
LEV 1:3 If his offering [be] a burnt sacrifice of the herd, let him offer a male without blemish: he shall offer it of his own voluntary will at the door of the tabernacle of the congregation before the LORD.
NUM 1:1 And the LORD spake unto Moses in the wilderness of Sinai, in the tabernacle of the congregation, on the first [day] of the second month, in the second year after they were come out of the land of Egypt, saying,
NUM 1:2 Take ye the sum of all the congregation of the children of Israel, after their families, by the house of their fathers, with the number of [their] names, every male by their polls;
NUM 1:3 From twenty years old and upward, all that are able to go forth to war in Israel: thou and Aaron shall number them by their armies.
DEU 1:1 These [be] the words which Moses spake unto all Israel on this side Jordan in the wilderness, in the plain over against the Red [sea], between Paran, and Tophel, and Laban, and Hazeroth, and Dizahab.
DEU 1:2 ([There are] eleven days' [journey] from Horeb by the way of mount Seir unto Kadeshbarnea.)
DEU 1:3 And it came to pass in the fortieth year, in the eleventh month, on the first [day] of the month, [that] Moses spake unto the children of Israel, according unto all that the LORD had given him in commandment unto them;
JOS 1:1 Now after the death of Moses the servant of the LORD it came to pass, that the LORD spake unto Joshua the son of Nun, Moses' minister, saying,
JOS 1:2 Moses my servant is dead; now therefore arise, go over this Jordan, thou, and all this people, unto the land which I do give to them, [even] to the children of Israel.
JDG 1:1 Now after the death of Joshua it came to pass, that the children of Israel asked the LORD, saying, Who shall go up for us against the Canaanites first, to fight against them?
JDG 1:2 And the LORD said, Judah shall go up: behold, I have delivered the land into his hand.
RUT 1:1 Now it came to pass in the days when the judges ruled, that there was a famine in the land. And a certain man of Bethlehemjudah went to sojourn in the country of Moab, he, and his wife, and his two sons.
RUT 1:2 And the name of the man [was] Elimelech, and the name of his wife Naomi, and the name of his two sons Mahlon and Chilion, Ephrathites of Bethlehemjudah. And they came into the country of Moab, and continued there.`;

// Sample Arabic data for bilingual comparison
const SAMPLE_ARABIC_DATA = `GEN 1:1 فِي الْبَدْءِ خَلَقَ اللهُ السَّمَاوَاتِ وَالأَرْضَ.
GEN 1:2 وَكَانَتِ الأَرْضُ خَرِبَةً وَخَالِيَةً، وَعَلَى وَجْهِ الْغَمْرِ ظُلْمَةٌ، وَرُوحُ اللهِ يَرِفُّ عَلَى وَجْهِ الْمِيَاهِ.
GEN 1:3 وَقَالَ اللهُ: «لِيَكُنْ نُورٌ»، فَكَانَ نُورٌ.
GEN 1:4 وَرَأَى اللهُ النُّورَ أَنَّهُ حَسَنٌ. وَفَصَلَ اللهُ بَيْنَ النُّورِ وَالظُّلْمَةِ.
GEN 1:5 وَدَعَا اللهُ النُّورَ نَهَارًا، وَالظُّلْمَةُ دَعَاهَا لَيْلًا. وَكَانَ مَسَاءٌ وَكَانَ صَبَاحٌ يَوْمًا وَاحِدًا.
GEN 1:6 وَقَالَ اللهُ: «لِيَكُنْ جَلَدٌ فِي وَسَطِ الْمِيَاهِ. وَلْيَكُنْ فَاصِلًا بَيْنَ مِيَاهٍ وَمِيَاهٍ».
GEN 1:7 فَعَمِلَ اللهُ الْجَلَدَ، وَفَصَلَ بَيْنَ الْمِيَاهِ الَّتِي تَحْتَ الْجَلَدِ وَالْمِيَاهِ الَّتِي فَوْقَ الْجَلَدِ. وَكَانَ كَذلِكَ.
GEN 1:8 وَدَعَا اللهُ الْجَلَدَ سَمَاءً. وَكَانَ مَسَاءٌ وَكَانَ صَبَاحٌ يَوْمًا ثَانِيًا.
GEN 1:9 وَقَالَ اللهُ: «لِتَجْتَمِعِ الْمِيَاهُ تَحْتَ السَّمَاءِ إِلَى مَكَانٍ وَاحِدٍ، وَلْتَظْهَرِ الْيَابِسَةُ». وَكَانَ كَذلِكَ.
GEN 1:10 وَدَعَا اللهُ الْيَابِسَةَ أَرْضًا، وَمُجْتَمَعَ الْمِيَاهِ دَعَاهُ بِحَارًا. وَرَأَى اللهُ ذلِكَ أَنَّهُ حَسَنٌ.
GEN 2:1 فَأُكْمِلَتِ السَّمَاوَاتُ وَالأَرْضُ وَكُلُّ جُنْدِهَا.
GEN 2:2 وَفَرَغَ اللهُ فِي الْيَوْمِ السَّابعِ مِنْ عَمَلِهِ الَّذِي عَمِلَ. فَاسْتَرَاحَ فِي الْيَوْمِ السَّابعِ مِنْ جَمِيعِ عَمَلِهِ الَّذِي عَمِلَ.
GEN 2:3 وَبَارَكَ اللهُ الْيَوْمَ السَّابعَ وَقَدَّسَهُ، لأَنَّهُ فِيهِ اسْتَرَاحَ مِنْ جَمِيعِ عَمَلِهِ الَّذِي عَمِلَ اللهُ خَالِقًا.
GEN 3:1 وَكَانَتِ الْحَيَّةُ أَحْيَلَ جَمِيعِ حَيَوَانَاتِ الْبَرِّيَّةِ الَّتِي عَمِلَهَا الرَّبُّ الإِلهُ.
GEN 6:1 وَحَدَثَ لَمَّا ابْتَدَأَ النَّاسُ يَكْثُرُونَ عَلَى الأَرْضِ، وَوُلِدَ لَهُمْ بَنَاتٌ،
GEN 6:2 أَنَّ أَبْنَاءَ اللهِ رَأَوْا بَنَاتِ النَّاسِ أَنَّهُنَّ حَسَنَاتٌ. فَاتَّخَذُوا لأَنْفُسِهِمْ نِسَاءً مِنْ كُلِّ مَا اخْتَارُوا.`;

export interface Language {
  code: string;
  name: string;
  isRTL: boolean;
  data: BibleData;
}

// Available languages for the prototype
export const AVAILABLE_LANGUAGES: Omit<Language, 'data'>[] = [
  { code: 'en-kjv', name: 'English (KJV)', isRTL: false },
  { code: 'ar', name: 'Arabic', isRTL: true },
];

export function useBible() {
  const [isLoading, setIsLoading] = useState(true);
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    // Parse sample data
    const kjvData = parseBibleText(SAMPLE_KJV_DATA);
    const arabicData = parseBibleText(SAMPLE_ARABIC_DATA);

    setLanguages([
      { code: 'en-kjv', name: 'English (KJV)', isRTL: false, data: kjvData },
      { code: 'ar', name: 'Arabic', isRTL: true, data: arabicData },
    ]);
    setIsLoading(false);
  }, []);

  const getLanguage = (code: string): Language | undefined => {
    return languages.find(l => l.code === code);
  };

  const getBooks = (languageCode: string): Book[] => {
    const lang = getLanguage(languageCode);
    return lang?.data.books || [];
  };

  const getChapters = (languageCode: string, bookCode: string): number[] => {
    const lang = getLanguage(languageCode);
    if (!lang) return [];
    return getBookChapters(lang.data, bookCode);
  };

  const getVerses = (languageCode: string, bookCode: string, chapter: number): Verse[] => {
    const lang = getLanguage(languageCode);
    if (!lang) return [];
    return getChapterVerses(lang.data, bookCode, chapter);
  };

  return {
    isLoading,
    languages,
    getLanguage,
    getBooks,
    getChapters,
    getVerses,
    availableLanguages: AVAILABLE_LANGUAGES,
  };
}
