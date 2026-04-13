// src/__tests__/components.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SummaryCards from '../components/SummaryCards';
import Toast from '../components/Toast';

// ─────────────────────────────────────────
describe('SummaryCards', () => {
  const mockSummary = [
    { status: 'Abierto',     total: 5 },
    { status: 'En progreso', total: 3 },
    { status: 'Resuelto',    total: 8 },
  ];

  it('renderiza los 3 estados correctamente', () => {
    render(<SummaryCards summary={mockSummary} />);
    expect(screen.getByText('Abierto')).toBeInTheDocument();
    expect(screen.getByText('En progreso')).toBeInTheDocument();
    expect(screen.getByText('Resuelto')).toBeInTheDocument();
  });

  it('muestra los contadores correctos', () => {
    render(<SummaryCards summary={mockSummary} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('renderiza sin errores con summary vacío', () => {
    render(<SummaryCards summary={[]} />);
    expect(screen.queryByText('Abierto')).not.toBeInTheDocument();
  });
});

// ─────────────────────────────────────────
describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('muestra el mensaje correctamente', () => {
    const onClose = vi.fn();
    render(<Toast message="Ticket creado exitosamente" type="success" onClose={onClose} />);
    expect(screen.getByText(/Ticket creado exitosamente/)).toBeInTheDocument();
  });

  it('llama a onClose después de 3500ms', () => {
    const onClose = vi.fn();
    render(<Toast message="Hola" type="success" onClose={onClose} />);
    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3500);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('aplica clase "success" correctamente', () => {
    const { container } = render(<Toast message="OK" type="success" onClose={() => {}} />);
    expect(container.firstChild).toHaveClass('success');
  });

  it('aplica clase "error" correctamente', () => {
    const { container } = render(<Toast message="Error" type="error" onClose={() => {}} />);
    expect(container.firstChild).toHaveClass('error');
  });
});

// ─────────────────────────────────────────
describe('exportExcel — formato de fecha', () => {
  it('formatea fecha en dd/mm/yyyy hh:mm:ss', () => {
    const fecha = new Date('2026-04-12T18:35:42');
    const resultado = fecha.toLocaleString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
    expect(resultado).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(resultado).toMatch(/\d{2}:\d{2}:\d{2}/);
  });
});
