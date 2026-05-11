require('dotenv').config();
const mongoose = require('mongoose');
const Produk = require('./models/Produk');

const MONGO_URL = process.env.MONGO_URL;

const produkData = [
  {
    nama: 'Batik Sumenep',
    deskripsi: 'Batik Sumenep is a traditional batik craft originating from Sumenep in the region of Madura. This batik is known for its bright colors and distinctive motifs that reflect the culture and daily life of the Madurese people. The motifs of Batik Sumenep are often inspired by nature, plants, and local cultural symbols, such as flowers, leaves, and geometric patterns. Common colors used include red, yellow, blue, and green, which symbolize the cheerfulness and bravery of the Madurese community.',
    harga: 500000,
    stok: 50,
    gambar: 'img/batik sumenep.jpg',
    kategori: 'Fashion'
  },
  {
    nama: 'Bolu Jubada',
    deskripsi: 'Bolu Jubada is a traditional cake from Madura that is well known as a sweet snack and a typical regional souvenir. The cake has a soft and light texture with a distinctive sweet flavor, making it popular among both local people and visitors.',
    harga: 15000,
    stok: 200,
    gambar: 'img/bolu jubada.png',
    kategori: 'Makanan'
  },
  {
    nama: 'Buah Siwalan',
    deskripsi: 'Siwalan is a fruit that comes from the lontar palm tree, which grows widely in hot regions such as Madura. This fruit is very popular in Madura because it tastes sweet and refreshing and has a soft, jelly-like texture.',
    harga: 36000,
    stok: 100,
    gambar: 'img/buah siwalan.jpg',
    kategori: 'Makanan'
  },
  {
    nama: 'Kacang Otok',
    deskripsi: 'Kacang Otok is a traditional snack from Madura that is popular as a local delicacy and souvenir. It is usually made from peanuts that are boiled or roasted with special spices, producing a savory, slightly salty, and fragrant taste. The name "otok" comes from the Madurese language and refers to the method of cooking the peanuts with spices until the flavor is fully absorbed.',
    harga: 15000,
    stok: 300,
    gambar: 'img/kacang otok.png',
    kategori: 'Makanan'
  },
  {
    nama: 'Kaus Sakera',
    deskripsi: "Sakera Shirt is inspired by a legendary figure from Madura named Sakera, who is known as a folk hero from Bangkalan. Sakera lived during the Dutch colonial period and was famous for his bravery in fighting against injustice and oppression toward the people. This shirt was originally created as a typical souvenir from Madura and as a way to preserve the story and the spirit of Sakera's struggle for younger generations.",
    harga: 40000,
    stok: 150,
    gambar: 'img/kaos sakera.jpeg',
    kategori: 'Fashion'
  },
  {
    nama: 'Keripik Terung',
    deskripsi: 'Keripik Terung is a traditional snack made from eggplant that is thinly sliced and fried until crispy. This snack is quite popular in several regions of Indonesia, including Madura, and is often enjoyed as a light snack or a regional souvenir.',
    harga: 40000,
    stok: 250,
    gambar: 'img/keripik terung.png',
    kategori: 'Makanan'
  },
  {
    nama: 'Keripik Tette',
    deskripsi: 'Keripik Tette is a traditional snack from Madura, especially from Sumenep. It is made from cassava that is first boiled, then flattened (tette or pressed), and finally fried until crispy. The word "tette" comes from the Madurese language and means "to pound or flatten."',
    harga: 25000,
    stok: 300,
    gambar: 'img/keripik tette.jpeg',
    kategori: 'Makanan'
  },
  {
    nama: 'Kue Macho',
    deskripsi: 'Kue Macho is a traditional cake from Sumenep on Madura. This cake is known for its sweet taste and soft texture, and it is often sold as a typical souvenir from Madura. Besides being enjoyed as a daily snack, Kue Macho is also sometimes served at family gatherings, celebrations, or when welcoming guests.',
    harga: 20000,
    stok: 200,
    gambar: 'img/kue macho.png',
    kategori: 'Makanan'
  },
  {
    nama: 'Miniatur Karapan Sapi',
    deskripsi: 'A Miniature Karapan Sapi is a handicraft in the form of a small model representing the famous Karapan Sapi from Madura. It is commonly produced as a souvenir or local gift. The miniature usually depicts a pair of bulls pulling a small carriage (kaleles), similar to the real race. These crafts are typically made from wood, bamboo, or other materials and decorated with bright colors and traditional Madurese ornaments.',
    harga: 400000,
    stok: 30,
    gambar: 'img/miniatur karapan sapi.png',
    kategori: 'Kerajinan'
  },
  {
    nama: 'Odheng',
    deskripsi: 'Odheng is a traditional headcloth worn by men in Madura. It is usually made from batik fabric or cloth with traditional Madurese patterns and folded in a specific way to form a distinctive head covering. Odheng symbolizes honor, bravery, and the identity of Madurese men, and it is commonly worn during traditional ceremonies, cultural performances, and official events.',
    harga: 25000,
    stok: 100,
    gambar: 'img/odheng.png',
    kategori: 'Fashion'
  },
  {
    nama: 'Petis Madura',
    deskripsi: 'Petis Madura is a traditional specialty from Madura. It is a thick paste that is dark brown or black in color, made by boiling shrimp or fish water until it thickens, then adding sugar, salt, and other seasonings, resulting in a savory and slightly sweet flavor.',
    harga: 20000,
    stok: 200,
    gambar: 'img/petis madura.png',
    kategori: 'Makanan'
  },
  {
    nama: 'Rengginang Lorjuk',
    deskripsi: 'Rengginang Lorjuk is a traditional snack from Madura, especially from Sumenep and Pamekasan. It is a type of cracker made from glutinous rice mixed with lorjuk, a small sea clam that lives in the sandy coastal areas of Madura.',
    harga: 30000,
    stok: 150,
    gambar: 'img/rengginang lorjuk.png',
    kategori: 'Makanan'
  }
];

async function seed() {
  await mongoose.connect(MONGO_URL);
  console.log('Database terhubung!');

  await Produk.deleteMany({});
  console.log('Data lama dihapus.');

  const inserted = await Produk.insertMany(produkData);
  console.log(`${inserted.length} produk berhasil dimasukkan:\n`);
  inserted.forEach(p => console.log(`  ${p.nama} — ID: ${p._id}`));

  await mongoose.disconnect();
}

seed().catch(console.error);