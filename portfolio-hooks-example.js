// Copy this file to your portfolio project: hooks/useSupabaseRealtime.js
// This hook automatically updates when dashboard makes changes

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase'; // Adjust path to your supabase client

/**
 * Hook to fetch and subscribe to Supabase table changes
 * Automatically updates when data changes in the dashboard
 * 
 * @param {string} tableName - Name of the Supabase table
 * @param {object} options - Configuration options
 * @param {string} options.orderBy - Column to order by (default: 'created_at')
 * @param {boolean} options.ascending - Sort order (default: false)
 * @param {object} options.filter - Object with key-value pairs to filter by (e.g., { section: 'home' })
 * @returns {object} { data, loading, error }
 */
export function useSupabaseRealtime(tableName, options = {}) {
  const { 
    orderBy = 'created_at', 
    ascending = false, 
    filter = null 
  } = options;
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Function to load data from Supabase
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        let query = supabase.from(tableName).select('*');

        // Apply filters if provided
        if (filter && typeof filter === 'object') {
          Object.entries(filter).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              query = query.eq(key, value);
            }
          });
        }

        // Apply ordering
        query = query.order(orderBy, { ascending });

        const { data: result, error: queryError } = await query;

        if (queryError) throw queryError;

        if (isMounted) {
          setData(result || []);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error loading ${tableName}:`, err);
        if (isMounted) {
          setError(err);
          setData([]);
          setLoading(false);
        }
      }
    }

    // Initial data load
    loadData();

    // Subscribe to realtime changes
    const channelName = `${tableName}-changes-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          console.log(`${tableName} change detected:`, payload.eventType);
          // Refetch data when any change occurs
          loadData();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Subscribed to ${tableName} changes`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`❌ Failed to subscribe to ${tableName} changes`);
        }
      });

    // Cleanup function
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [tableName, orderBy, ascending, JSON.stringify(filter)]);

  return { data, loading, error };
}

// Convenience hooks for specific tables
export function useProjects(lang = 'EN') {
  const { data, loading, error } = useSupabaseRealtime('projects');
  return { projects: data, loading, error };
}

export function useSkills() {
  const { data, loading, error } = useSupabaseRealtime('skills');
  return { skills: data, loading, error };
}

export function useExperiences() {
  const { data, loading, error } = useSupabaseRealtime('experiences');
  return { experiences: data, loading, error };
}

export function useEducation() {
  const { data, loading, error } = useSupabaseRealtime('education', {
    orderBy: 'year_start',
    ascending: false
  });
  
  // Calculate year_display on frontend
  const educationWithDisplay = data.map(item => ({
    ...item,
    year_display: item.year_end && item.year_start !== item.year_end
      ? `${item.year_start}-${item.year_end}`
      : item.year_start
  }));
  
  return { education: educationWithDisplay, loading, error };
}

export function useContent(section) {
  const { data, loading, error } = useSupabaseRealtime('content', {
    filter: { section },
    orderBy: 'display_order',
    ascending: true
  });
  return { content: data, loading, error };
}

// Example usage in a React component:
/*
import { useProjects, useSkills, useContent } from '../hooks/useSupabaseRealtime';

function PortfolioPage() {
  const { projects, loading: projectsLoading } = useProjects('EN');
  const { skills, loading: skillsLoading } = useSkills();
  const { content: homeContent, loading: contentLoading } = useContent('home');

  if (projectsLoading || skillsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{homeContent.find(c => c.key === 'know_me_title')?.content_en}</h1>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
      {skills.map(skill => (
        <SkillItem key={skill.id} skill={skill} />
      ))}
    </div>
  );
}
*/

