import { NeonIssue, NeonKeyword, NeonReview, NeonScores, NeonSuggestion } from "@/types/dashboard";

const now = new Date();
const formatDate = (date: Date) => date.toLocaleDateString("tr-TR", { month: "short", day: "numeric" });

const trendDates = Array.from({ length: 7 }).map((_, index) => {
  const date = new Date(now);
  date.setDate(now.getDate() - (6 - index));
  return formatDate(date);
});

const accentPalette = ["#FF00FF", "#00D1FF", "#7F00FF", "#38bdf8"];

const keywords: NeonKeyword[] = [
  {
    id: "kw-1",
    keyword: "neon tabela",
    volume: 5400,
    difficulty: 32,
    accent: accentPalette[0],
    trend: trendDates.map((date, idx) => ({ dateLabel: date, position: 5 + Math.sin(idx) * 2 }))
  },
  {
    id: "kw-2",
    keyword: "rgb neon tabela",
    volume: 1600,
    difficulty: 28,
    accent: accentPalette[1],
    trend: trendDates.map((date, idx) => ({ dateLabel: date, position: 9 - Math.cos(idx) * 1.5 }))
  },
  {
    id: "kw-3",
    keyword: "özel neon yazı",
    volume: 2100,
    difficulty: 36,
    accent: accentPalette[2],
    trend: trendDates.map((date, idx) => ({ dateLabel: date, position: 12 - Math.sin(idx / 2) * 1.2 }))
  }
];

const reviews: NeonReview[] = [
  {
    id: "rv-1",
    platform: "Google",
    sentiment: "positive",
    author: "Elif K.",
    text: "Hızlı teslimat ve mükemmel parlaklık!",
    date: now.toISOString()
  },
  {
    id: "rv-2",
    platform: "Şikayetvar",
    sentiment: "negative",
    author: "Mert D.",
    text: "Kargo gecikti fakat destek hızlı çözdü.",
    date: now.toISOString()
  },
  {
    id: "rv-3",
    platform: "Instagram",
    sentiment: "neutral",
    author: "@neonlover",
    text: "Yeni modelinizi merakla bekliyorum!",
    date: now.toISOString()
  }
];

const suggestions: NeonSuggestion[] = [
  {
    id: "sg-1",
    type: "SEO",
    message: "3 ürün sayfasının meta açıklaması 170 karakteri aşıyor. Optimize etmeyi deneyin.",
    createdAt: now.toISOString()
  },
  {
    id: "sg-2",
    type: "Reputation",
    message: "Son 48 saatte 2 yorum 'kargo gecikmesi' içeriyor. Lojistik bildirimleri güncelleyin.",
    createdAt: now.toISOString()
  },
  {
    id: "sg-3",
    type: "Keywords",
    message: "Trend anahtar kelime: 'rgb neon tabela montajı'. Blog yazısı planlayın.",
    createdAt: now.toISOString()
  }
];

const issues: NeonIssue[] = [
  {
    id: "is-1",
    issue: "10 sayfada birden fazla H1 etiketi tespit edildi.",
    severity: "high",
    fix: "İçerik şablonunu güncelleyerek tekil H1 kullanın.",
    timestamp: now.toISOString()
  },
  {
    id: "is-2",
    issue: "/kampanyalar sayfasında 4 broken link bulundu.",
    severity: "critical",
    fix: "Yönlendirmeleri kontrol edip 301 ile düzeltin.",
    timestamp: now.toISOString()
  }
];

const scores: NeonScores = {
  seoScore: 78,
  speedScore: 72,
  reputationScore: 84,
  engagementScore: 66,
  totalScore: 76
};

export const defaultMockState = { scores, keywords, reviews, suggestions, issues };
