import { db } from '@/lib/prisma'

async function createSamplePosts() {
  try {
    // Get existing data
    const author = await db.user.findFirst({
      where: { email: 'admin@butcapp.com' }
    })
    
    const kisiselFinans = await db.category.findFirst({
      where: { slug: 'kişisel-finans' }
    })
    
    const yatirimStratejileri = await db.category.findFirst({
      where: { slug: 'yatirim-stratejileri' }
    })
    
    const butce = await db.tag.findFirst({
      where: { slug: 'butc' }
    })
    
    const birikim = await db.tag.findFirst({
      where: { slug: 'birikim' }
    })
    
    const yatirim = await db.tag.findFirst({
      where: { slug: 'yatirim' }
    })

    if (!author || !kisiselFinans || !yatirimStratejileri || !butce || !birikim || !yatirim) {
      console.error('Missing required data. Found:')
      console.log('Author:', !!author)
      console.log('Kişisel Finans:', !!kisiselFinans)
      console.log('Yatırım Stratejileri:', !!yatirimStratejileri)
      console.log('Bütçe:', !!butce)
      console.log('Birikim:', !!birikim)
      console.log('Yatırım:', !!yatirim)
      return
    }

    console.log('All required data found, creating posts...')
    console.log('Author ID:', author.id)
    console.log('Category IDs:', kisiselFinans.id, yatirimStratejileri.id)
    console.log('Tag IDs:', butce.id, birikim.id, yatirim.id)

    console.log('Creating sample posts...')

    // Create sample posts
    const post1 = await db.post.create({
      data: {
        title: '2024 Yılında Kişisel Finans Yönetimi İçin 10 Altın Kural',
        slug: '2024-yilinda-kisisel-finans-yonetimi-icin-10-altin-kural',
        excerpt: 'Yeni yılda finansal hedeflerinize ulaşmak için uygulayabileceğiniz etkili kişisel finans yönetimi stratejileri.',
        content: `# 2024 Yılında Kişisel Finans Yönetimi İçin 10 Altın Kural

Finansal sağlığınızı iyileştirmek ve para biriktirmek için 2024 yılında uygulayabileceğiniz 10 etkili kural:

## 1. Detaylı Bütçe Oluşturun
Gelir ve giderlerinizi detaylı bir şekilde takip edin. ButcApp gibi uygulamalar kullanarak harcamalarınızı kategorilere ayırın.

## 2. Acil Durum Fonu Oluşturun
En az 3-6 aylık yaşam masrafınızı karşılayacak bir acil durum fonu oluşturun.

## 3. Borçlarınızı Önceliklendirin
Yüksek faizli borçlarınızı öncelikli olarak ödeyin. Kredi kartı borçlarından kurtulun.

## 4. Otomatik Birikim Başlatın
Maaşınızın %10-15'ini otomatik olarak birikim hesabınıza aktarın.

## 5. Yatırımlara Başlayın
Enflasyonun üzerinde getiri sağlamak için yatırım yapın. Diversifikasyon önemlidir.

Bu kuralları düzenli olarak uygulayarak 2024 yılında finansal hedeflerinize ulaşabilirsiniz.`,
        featured: true,
        readTime: 3,
        seoTitle: '2024 Kişisel Finans Yönetimi İpuçları',
        seoDescription: '2024 yılında finansal hedeflerinize ulaşmak için 10 etkili kişisel finans yönetimi kuralı.',
        keywords: 'kişisel finans, bütçe, birikim, finansal planlama',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: author.id,
        categoryId: kisiselFinans.id,
        tags: {
          connect: [
            { id: butce.id },
            { id: birikim.id }
          ]
        }
      }
    })

    const post2 = await db.post.create({
      data: {
        title: 'Yeni Başlayanlar için Yatırım Rehberi',
        slug: 'yeni-baslayanlar-icin-yatirim-rehberi',
        excerpt: 'Yatırıma nereden başlayacağınızı bilmeyenler için kapsamlı bir rehber. Temel kavramlar ve stratejiler.',
        content: `# Yeni Başlayanlar için Yatırım Rehberi

Yatırım dünyasına adım atmak göz korkutucu olabilir, ancak doğru bilgi ve strateji ile başarılı olabilirsiniz.

## Yatırım Nedir?
Yatırım, gelecekteki finansal hedeflerinize ulaşmak için paranızı çalıştırmaktır.

## Temel Yatırım Araçları

### 1. Hisse Senetleri
Şirketlerin ortaklık senetleridir. Şirket kar ettiğinde değer kazanır.

### 2. Tahviller
Devlet veya şirketlerin borçlanma senetleridir. Düşük riskli yatırım aracıdır.

### 3. Fonlar
Çok sayıda yatırımcının parasının toplanıp profesyonel yöneticiler tarafından yönetildiği yatırım araçlarıdır.

Unutmayın, yatırım bir maraton, sprint değil. Sabırlı ve disiplinli olun.`,
        featured: false,
        readTime: 2,
        seoTitle: 'Yeni Başlayanlar İçin Yatırım Rehberi',
        seoDescription: 'Yatırıma yeni başlayanlar için temel bilgiler, yatırım araçları ve stratejiler.',
        keywords: 'yatırım, hisse senedi, kripto para, fon, tahvil',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: author.id,
        categoryId: yatirimStratejileri.id,
        tags: {
          connect: [
            { id: yatirim.id }
          ]
        }
      }
    })

    const post3 = await db.post.create({
      data: {
        title: 'Bütçe Yaparken Yapılan 5 Yaygın Hata',
        slug: 'butce-yaparken-yapilan-5-yaygin-hata',
        excerpt: 'Bütçe yaparken çoğu insanın yaptığı hatalar ve bu hatalardan nasıl kaçınılacağı.',
        content: `# Bütçe Yaparken Yapılan 5 Yaygın Hata

Bütçe yapmak finansal özgürlüğün ilk adımıdır, ancak yanlış yaklaşımlar başarısızlığa neden olabilir.

## 1. Gerçekçi Olmamak
En yaygın hata, bütçenin gerçekçi olmamasıdır. Gelirinizi ve giderlerinizi abartılı bir şekilde tahmin etmek.

**Çözüm**: Son 3 ayın harcamalarınızı analiz ederek gerçekçi bir bütçe oluşturun.

## 2. Esnek Olmamak
Bütçenin katı kurallara bağlanması, sürdürülebilir olmasını engeller.

**Çözüm**: Bütçenize esneklik katın. Beklenmedik harcamalar için pay ayırın.

Bütçe yapmak ceza değil, finansal özgürlüğe giden yoldur. Doğru yaklaşım ile başarılı olabilirsiniz.`,
        featured: false,
        readTime: 2,
        seoTitle: 'Bütçe Yaparken Yapılan Yaygın Hatalar',
        seoDescription: 'Bütçe yaparken yapılan 5 yaygın hata ve çözüm önerileri.',
        keywords: 'bütçe, finansal hata, harcama takibi, kişisel finans',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: author.id,
        categoryId: kisiselFinans.id,
        tags: {
          connect: [
            { id: butce.id }
          ]
        }
      }
    })

    console.log('Sample posts created successfully!')
    console.log(`Created 3 posts:`)
    console.log(`1. ${post1.title}`)
    console.log(`2. ${post2.title}`)
    console.log(`3. ${post3.title}`)

  } catch (error) {
    console.error('Error creating sample posts:', error)
  } finally {
    await db.$disconnect()
  }
}

// Run function
createSamplePosts()