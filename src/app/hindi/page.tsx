import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Calculator,
  FileSearch,
  FileSignature,
  Gavel,
  Home,
  Briefcase,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "भारतीय कानूनी उपकरण और मार्गदर्शिकाएँ — मुफ्त | LexiReview",
  description:
    "भारतीय नागरिकों के लिए मुफ्त कानूनी उपकरण — किराया अनुबंध, स्टाम्प ड्यूटी कैलकुलेटर, नौकरी पत्र विश्लेषण, NDA, उपभोक्ता शिकायत। हिंदी में।",
  alternates: {
    canonical: "https://lexireview.in/hindi",
    languages: {
      en: "https://lexireview.in/tools",
      hi: "https://lexireview.in/hindi",
    },
  },
};

const TOOLS = [
  {
    href: "/tools/rent-agreement-generator?lang=hi",
    title: "किराया अनुबंध जनरेटर",
    subtitle: "Rent Agreement Generator",
    description:
      "भारत के किसी भी राज्य के लिए तैयार किराया अनुबंध। आवासीय या व्यावसायिक।",
    icon: FileText,
  },
  {
    href: "/tools/stamp-duty-calculator?lang=hi",
    title: "स्टाम्प ड्यूटी कैलकुलेटर",
    subtitle: "Stamp Duty Calculator",
    description:
      "28 राज्यों और 8 केंद्र शासित प्रदेशों में स्टाम्प ड्यूटी की गणना करें।",
    icon: Calculator,
  },
  {
    href: "/tools/offer-letter-decoder?lang=hi",
    title: "नौकरी पत्र विश्लेषक",
    subtitle: "Offer Letter Decoder",
    description: "AI आपके ऑफर लेटर की जाँच करता है — लाल झंडे और बातचीत के सुझाव।",
    icon: FileSearch,
  },
  {
    href: "/tools/nda-generator?lang=hi",
    title: "गोपनीयता समझौता (NDA) जनरेटर",
    subtitle: "NDA Generator",
    description: "भारतीय अनुबंध अधिनियम के अनुरूप म्यूचुअल, वन-वे, या निवेशक NDA।",
    icon: FileSignature,
  },
  {
    href: "/tools/consumer-complaint-drafter?lang=hi",
    title: "उपभोक्ता शिकायत प्रारूप",
    subtitle: "Consumer Complaint Drafter",
    description:
      "उपभोक्ता संरक्षण अधिनियम 2019 के तहत शिकायत का मसौदा तैयार करें।",
    icon: Gavel,
  },
  {
    href: "/tools/rental-receipt-generator?lang=hi",
    title: "किराया रसीद जनरेटर",
    subtitle: "Rental Receipt Generator",
    description: "HRA कर छूट के लिए PAN विवरण के साथ किराया रसीद।",
    icon: FileText,
  },
  {
    href: "/tools/gratuity-calculator?lang=hi",
    title: "ग्रेच्युटी कैलकुलेटर",
    subtitle: "Gratuity Calculator",
    description: "ग्रेच्युटी अधिनियम 1972 के अनुसार अपनी ग्रेच्युटी की गणना करें।",
    icon: Briefcase,
  },
  {
    href: "/tools/rti-application-drafter?lang=hi",
    title: "RTI आवेदन प्रारूप",
    subtitle: "RTI Application Drafter",
    description: "सूचना का अधिकार अधिनियम 2005 के तहत RTI आवेदन।",
    icon: FileText,
  },
];

const SEGMENTS = [
  { href: "/citizens/tenants", hi: "किरायेदार और मकान मालिक", en: "Tenants & Landlords", icon: Home },
  { href: "/citizens/employees", hi: "कर्मचारी और नौकरी चाहने वाले", en: "Employees & Job Seekers", icon: Users },
  { href: "/citizens/home-buyers", hi: "गृह खरीदार", en: "Home Buyers", icon: Home },
  { href: "/citizens/msme-owners", hi: "MSME मालिक", en: "MSME Owners", icon: Briefcase },
  { href: "/citizens/consumers", hi: "उपभोक्ता विवाद", en: "Consumer Disputes", icon: Gavel },
  { href: "/citizens/nri", hi: "NRI", en: "NRIs", icon: Users },
  { href: "/citizens/senior-citizens", hi: "वरिष्ठ नागरिक", en: "Senior Citizens", icon: Users },
  { href: "/citizens/freelancers", hi: "फ्रीलांसर और गिग कर्मी", en: "Freelancers", icon: Briefcase },
];

export default function HindiHubPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-700 to-blue-900 px-4 pt-20 pb-14 text-white sm:px-6 sm:pt-28 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles size={12} /> मुफ्त नागरिक उपकरण · FREE CITIZEN TOOLS
          </span>
          <h1 className="font-heading text-3xl font-bold sm:text-5xl">
            भारतीय नागरिकों के लिए कानूनी उपकरण
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-blue-100 sm:text-lg">
            मसौदा तैयार करें, विश्लेषण करें, विवाद करें — बिना किसी वकील के पहले इनवॉइस के।
            हर उपकरण वकीलों द्वारा समीक्षित है, भारतीय कानून के अनुसार है, और पूरी तरह मुफ्त है।
          </p>
          <div className="mt-4">
            <Link
              href="/tools"
              className="text-sm text-blue-200 underline decoration-dotted underline-offset-2"
            >
              View in English →
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mb-6">
            लोकप्रिय उपकरण
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group block rounded-xl border border-slate-200 bg-white p-6 hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <Icon size={24} className="text-blue-700 mb-3" />
                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-0.5 group-hover:text-blue-700">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-2">{t.subtitle}</p>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                    {t.description}
                  </p>
                  <span className="text-xs text-blue-700 font-semibold inline-flex items-center gap-1">
                    खोलें · Open <ArrowRight size={12} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Segments */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 bg-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mb-6">
            अपनी श्रेणी चुनें · Browse by Category
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SEGMENTS.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-5 text-center hover:border-blue-400 hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                    {s.hi}
                  </p>
                  <p className="text-[11px] text-slate-500">{s.en}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-gradient-to-br from-blue-800 to-blue-950 text-white px-8 py-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-heading font-black mb-3">
              भारत के 150,000+ उपयोगकर्ताओं द्वारा विश्वसनीय
            </h2>
            <p className="text-blue-100 max-w-xl mx-auto mb-6">
              Trusted by 150,000+ users across India
            </p>
            <Link
              href="https://app.lexireview.in/signup"
              className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-2xl font-bold hover:bg-blue-50"
            >
              मुफ्त ट्रायल शुरू करें · Start Free Trial
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs text-slate-500 text-center">
            ये उपकरण सूचनात्मक टेम्पलेट और अनुमान उत्पन्न करते हैं। ये कानूनी सलाह नहीं हैं।
            जटिल विवादों या महत्वपूर्ण मूल्य के मामलों के लिए, कृपया एक योग्य भारतीय वकील से परामर्श करें।
            <br />
            <span className="italic">
              These tools generate informational templates and estimates. Not legal advice.
              For matters of significant value, consult a qualified Indian advocate.
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
