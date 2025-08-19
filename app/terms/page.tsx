import { Metadata } from 'next';
import { supabaseAdmin } from '@/app/lib/supabase';

export const metadata: Metadata = {
  title: 'Terms of Service - Task Tracker',
  description: 'Terms of Service for Task Tracker application',
};

async function getLatestToS() {
  try {
    const { data, error } = await supabaseAdmin
      .from('tos')
      .select('*')
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching ToS:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getLatestToS:', error);
    return null;
  }
}

export default async function TermsPage() {
  const tos = await getLatestToS();

  if (!tos) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-xl text-muted-foreground mt-4">
            Terms of Service not available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span>Version {tos.version}</span>
            <span>•</span>
            <span>Effective: {new Date(tos.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {tos.content}
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>Last updated: {new Date(tos.updated_at || tos.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
} 