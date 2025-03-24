import useSWR, { mutate } from 'swr';
import { useRef, useMemo, useCallback } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

import { ALL_COLORS } from 'src/_mock/__colors';

// ----------------------------------------------------------------------

const enableServer = false;

const CALENDAR_ENDPOINT = endpoints.calendar;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

export function useGetEvents() {
  const { data, isLoading, error, isValidating } = useSWR(CALENDAR_ENDPOINT, fetcher, swrOptions);

  const memoizedValue = useMemo(() => {
    const events = data?.events.map((event) => ({
      ...event,
      textColor: event.color,
    }));

    return {
      events: events || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.events.length,
    };
  }, [data?.events, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProjectEvents(projects = []) {
  const colorMappingRef = useRef({});
  const usedColorsRef = useRef(new Set());

  const getAvailableColor = useCallback(() => {
    const available = ALL_COLORS.find((color) => !usedColorsRef.current.has(color));
    if (available) {
      usedColorsRef.current.add(available);
      return available;
    }
    return ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)];
  }, []);

  const memoizedValue = useMemo(() => {
    const events = projects.map((project) => {
      if (!colorMappingRef.current[project.id]) {
        colorMappingRef.current[project.id] = getAvailableColor();
      }
      const color = colorMappingRef.current[project.id];

      return {
        ...project,
        id: project.id,
        title: project.name,
        start: project.startDate,
        end: project.endDate ? project.endDate : '9999-12-31',
        textColor: color,
      };
    });

    return {
      events,
      eventsEmpty: projects.length === 0,
    };
  }, [projects, getAvailableColor]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createEvent(eventData) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { eventData };
    await axios.post(CALENDAR_ENDPOINT, data);
  }

  /**
   * Work in local
   */
  mutate(
    CALENDAR_ENDPOINT,
    (currentData) => {
      const currentEvents = currentData?.events;

      const events = [...currentEvents, eventData];

      return { ...currentData, events };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateEvent(eventData) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { eventData };
    await axios.put(CALENDAR_ENDPOINT, data);
  }

  /**
   * Work in local
   */
  mutate(
    CALENDAR_ENDPOINT,
    (currentData) => {
      const currentEvents = currentData?.events;

      const events = currentEvents.map((event) =>
        event.id === eventData.id ? { ...event, ...eventData } : event
      );

      return { ...currentData, events };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteEvent(eventId) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { eventId };
    await axios.patch(CALENDAR_ENDPOINT, data);
  }

  /**
   * Work in local
   */
  mutate(
    CALENDAR_ENDPOINT,
    (currentData) => {
      const currentEvents = currentData?.events;

      const events = currentEvents.filter((event) => event.id !== eventId);

      return { ...currentData, events };
    },
    false
  );
}
