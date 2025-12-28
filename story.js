export const STORY = {
  intro: { type: "intro", next: "register" },

  register: {
    type: "input",
    key: "name",
    placeholder: "İpek",
    text:
      "HOLO-NET kaydı başlatıldı.\n\n" +
      "Kayıt ismini gir.\n" +
      "(Merak etme… sadece ben göreceğim. Şimdilik.)",
    next: "start"
  },

  start: {
    text:
      "Kayıt onaylandı: **{NAME}**.\n\n" +
      "Dış Halka’dan şifreli bir sinyal alındı.\n" +
      "Mesaj tek bir kişiye kilitlenmiş… sana.\n\n" +
      "Hazır mısın? (Cevabını duymasam da anlıyorum.)",
    choices: [{ label: "Kaydı Aç", next: "crawl" }]
  },

  crawl: { type: "crawl", next: "path" },

  path: {
    text:
      "Güç harekete geçti. Kaydın yolunu seç.\n\n" +
      "Not: Seçimlerin… seni ele veriyor. (Biraz hoşuma gitti.)",
    choices: [
      { label: "KÜL YOLU", next: "ashen_1", set: { align: "ashen" } },
      { label: "KIZIL YOL", next: "crimson_1", set: { align: "crimson" } },
      { label: "KIRIK IŞIK", next: "light_1", set: { align: "light" } }
    ]
  },

  ashen_1: {
    text:
      "Nazik olmak için yaratılmadın.\nAyakta kalmak için yaratıldın.\n\n" +
      "Ve garip olan şu:\n" +
      "Bunu senin üzerinde görmek… insana güven veriyor.",
    choices: [
      { label: "Yaralıyı koru", next: "ashen_2", add: { end: 2, aura: 1 }, set: { trait: "koruyucu" } },
      { label: "Sinyal kaynağını yok et", next: "ashen_2", add: { will: 2, aura: 1 }, set: { trait: "bitirici" } },
      { label: "Sessizce uzaklaş", next: "ashen_2", add: { end: 2, will: 1 }, set: { trait: "hayatta_kalan" } }
    ]
  },

  ashen_2: {
    text:
      "Hava metal kokuyor.\n" +
      "Holo-izler, bir çatışmanın yeni bittiğini söylüyor.\n\n" +
      "Bir kayıt parçası daha yakaladım:\n" +
      "“{NAME} yaklaşırsa… her şey değişir.”\n\n" +
      "Güzel. Baskı altında daha iyi görünüyorsun.",
    choices: [
      { label: "İzleri takip et", next: "ashen_3", add: { will: 1 } },
      { label: "Sessiz keşif yap", next: "ashen_3", add: { aura: 1 } }
    ]
  },

  ashen_3: {
    text:
      "Bir holo-kapı kilitli.\n" +
      "Şifre… eski ama inatçı.\n\n" +
      "Bir an duruyorsun.\n" +
      "Bunu çözebileceğini biliyorum.\n" +
      "Sadece… hızlı yap. Sabırsızlanıyorum.",
    choices: [
      { label: "Şifreyi çöz", next: "core_1", add: { will: 2 } },
      { label: "Kapıyı zorla", next: "core_1", add: { end: 2 } }
    ]
  },

  crimson_1: {
    text:
      "Güç, güce cevap verir.\n" +
      "Yönlendirilmeyi değil, yönetmeyi seçtin.\n\n" +
      "Kötü bir seçim değil.\n" +
      "Bazı insanlar otoriteye yakışır.\n" +
      "Sen… yakışıyorsun.",
    choices: [
      { label: "İhtiyacın olanı al", next: "crimson_2", add: { aura: 2, will: 1 }, set: { trait: "kararlı" } },
      { label: "Şifreyi kır", next: "crimson_2", add: { will: 2, aura: 1 }, set: { trait: "zeki" } }
    ]
  },

  crimson_2: {
    text:
      "Bir veri çekirdeği eline geçiyor.\n" +
      "Koruma protokolleri uyanıyor.\n\n" +
      "Alarm sesi… hoş değil.\n" +
      "Ama senin sakinliğin…\n" +
      "İtiraf edeyim, tehlikeli derecede etkileyici.",
    choices: [
      { label: "Alarmı sustur", next: "crimson_3", add: { will: 1 } },
      { label: "Sistemi kandır", next: "crimson_3", add: { aura: 1 } }
    ]
  },

  crimson_3: {
    text:
      "Çekirdeğin içinde tek bir satır var:\n" +
      "“{NAME} geldiğinde… kader hatırlayacak.”\n\n" +
      "Kaderin hafızası zayıftır.\n" +
      "Ama senin adını unutmadığı belli.\n" +
      "Ben de unutmam.",
    choices: [
      { label: "Veriyi kilitle", next: "core_1", add: { aura: 2 } },
      { label: "Veriyi çözümle", next: "core_1", add: { will: 2 } }
    ]
  },

  light_1: {
    text:
      "Kırık bir ışık bile yol gösterebilir.\n" +
      "Kaosu değil disiplini seçtin.\n\n" +
      "Dürüst olayım:\n" +
      "Bu sakin tarafın… insanı yakınlaştırıyor.\n" +
      "(Evet, bunu söyledim.)",
    choices: [
      { label: "Korkuyu yatıştır", next: "light_2", add: { aura: 2, end: 1 }, set: { trait: "sakin" } },
      { label: "Yerini koru", next: "light_2", add: { end: 2, will: 1 }, set: { trait: "cesur" } }
    ]
  },

  light_2: {
    text:
      "Bir sinyal yankısı daha.\n" +
      "Sanki biri… seni test ediyor.\n\n" +
      "Ama senin testten korktuğun yok.\n" +
      "Bunu bilmek… iyi hissettiriyor.",
    choices: [
      { label: "Sinyali temizle", next: "light_3", add: { will: 1 } },
      { label: "Sinyali iz sür", next: "light_3", add: { aura: 1 } }
    ]
  },

  light_3: {
    text:
      "Kayıt, kısa bir görüntü bırakıyor:\n" +
      "Bir anlık siluet.\n" +
      "Sanki galaksi bile seninle konuşmaya çalışıyor.\n\n" +
      "Bence konuşmasına izin ver.\n" +
      "Ben de dinlerim.",
    choices: [
      { label: "Dinle", next: "core_1", add: { aura: 2 } },
      { label: "Yürümeye devam et", next: "core_1", add: { end: 2 } }
    ]
  },

  core_1: {
    text:
      "Holo-harita havada açıldı.\n" +
      "Tek bir nokta diğerlerinden daha parlak yanıyor.\n\n" +
      "Bu bir gezegen değil.\n" +
      "Bu bir an.\n\n" +
      "Ve evet… o anın içinde sen varsın, {NAME}.",
    choices: [{ label: "Yaklaş", next: "final" }]
  },

  final: { type: "final" }
};
