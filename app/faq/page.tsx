import { Metadata } from 'next';
import { supabaseAdmin } from '@/app/lib/supabase';

export const metadata: Metadata = {
  title: 'FAQ - Task Tracker',
  description: 'Frequently asked questions about Task Tracker',
};

export const dynamic = "force-static"

async function getFAQData() {
  try {
    const { data, error } = await supabaseAdmin
      .from('faq')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching FAQ:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getFAQData:', error);
    return [];
  }
}

export default async function FAQPage() {
  const faqs = await getFAQData();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground mt-4">
            Find answers to common questions about Task Tracker
          </p>
        </div>

        {faqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No FAQ items available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.id} className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}