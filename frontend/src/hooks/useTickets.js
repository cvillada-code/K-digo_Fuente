import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useTickets() {
  const [tickets, setTickets]     = useState([]);
  const [summary, setSummary]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [t, s] = await Promise.all([api.getTickets(), api.getSummary()]);
      setTickets(t);
      setSummary(s);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { tickets, summary, loading, error, refresh };
}

export function useCatalogs() {
  const [agents, setAgents]         = useState([]);
  const [clients, setClients]       = useState([]);
  const [priorities, setPriorities] = useState([]);

  useEffect(() => {
    Promise.all([api.getAgents(), api.getClients(), api.getPriorities()])
      .then(([a, c, p]) => { setAgents(a); setClients(c); setPriorities(p); })
      .catch(console.error);
  }, []);

  return { agents, clients, priorities };
}
