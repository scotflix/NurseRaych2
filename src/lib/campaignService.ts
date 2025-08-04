import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface CampaignParticipant {
  campaign_name: string;
  participant_name: string;
  participant_email: string;
  participant_role: 'advocate' | 'educator' | 'donor' | 'volunteer';
  location?: string;
  time_commitment?: string;
  metadata?: Record<string, any>;
}

export async function joinCampaign(participant: CampaignParticipant): Promise<string> {
  try {
    const { data, error } = await supabase
      .rpc('add_campaign_participant', {
        p_campaign_name: participant.campaign_name,
        p_participant_name: participant.participant_name,
        p_participant_email: participant.participant_email,
        p_participant_role: participant.participant_role,
        p_location: participant.location,
        p_time_commitment: participant.time_commitment,
        p_metadata: participant.metadata || {}
      });

    if (error) {
      console.error('Error joining campaign:', error);
      throw error;
    }

    return data; // Returns the participant ID
  } catch (error) {
    console.error('Failed to join campaign:', error);
    throw error;
  }
}

export async function getCampaignParticipants(campaignName: string) {
  try {
    const { data, error } = await supabase
      .from('campaign_participants')
      .select('*')
      .eq('campaign_name', campaignName)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaign participants:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch campaign participants:', error);
    throw error;
  }
}

export async function getParticipantsByEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from('campaign_participants')
      .select('*')
      .eq('participant_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching participant data:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch participant data:', error);
    throw error;
  }
}