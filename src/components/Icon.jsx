const P = {
  user: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  dice: ['M12 2l9 5v10l-9 5-9-5V7z', 'M12 12l9-5', 'M12 12L3 7', 'M12 12v10'],
  zap: ['M13 2L3 14h9l-1 8 10-12h-9z'],
  box: ['M21 8l-9-5-9 5v8l9 5 9-5z', 'M3 8l9 5 9-5', 'M12 13v8'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  note: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M8 13h8', 'M8 17h8'],
  voltar: ['M15 18l-6-6 6-6'],
  baixar: ['M12 3v12', 'M7 10l5 5 5-5', 'M5 21h14'],
  baixo: ['M12 5v14', 'M5 12l7 7 7-7'],
  busca: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M21 21l-4.3-4.3'],
  pe: ['M13 4a2 2 0 1 0 0-4', 'M5 22l4-8 3 3 4-6 3 11', 'M9 14l-2-4 5-2 3 3'],
  alvo: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z', 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'],
};

export default function Icon({ nome }) {
  return (
    <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {(P[nome] || []).map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}
