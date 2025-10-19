import { supabase } from '../lib/supabase';
import { ApplicationData } from '../types';

export async function saveApplication(data: Partial<ApplicationData>): Promise<string> {
  try {
    const { data: application, error } = await supabase
      .from('applications')
      .upsert({
        ...data,
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) throw error;
    return application.id;
  } catch (error) {
    console.error('Error saving application:', error);
    throw new Error('Failed to save application');
  }
}

export async function submitApplication(id: string, data: Partial<ApplicationData>): Promise<void> {
  try {
    const { error } = await supabase
      .from('applications')
      .update({
        ...data,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw new Error('Failed to submit application');
  }
}

export async function getApplication(id: string): Promise<ApplicationData | null> {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching application:', error);
    return null;
  }
}
