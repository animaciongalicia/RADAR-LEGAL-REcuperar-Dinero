
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './components/Landing';
import Wizard from './components/Wizard';
import Result from './components/Result';
import Privacy from './components/Privacy';
import { LeadData, ScoringResult, UTMParams } from './types';
import { calculateScore } from './utils/scoring';

const MainApp: React.FC = () => {
  const [view, setView] = useState<'landing' | 'wizard' | 'result'>('landing');
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [scoring, setScoring] = useState<ScoringResult | null>(null);
  const [utm, setUtm] = useState<UTMParams>({});

  useEffect(() => {
    // Capture UTM params from URL
    const params = new URLSearchParams(window.location.search);
    setUtm({
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
    });

    // Handle initial route if needed
    const hash = window.location.hash;
    if (hash === '#/wizard') setView('wizard');
    if (hash === '#/result' && leadData) setView('result');
  }, []);

  const handleWizardComplete = (data: LeadData) => {
    const results = calculateScore(data);
    setLeadData(data);
    setScoring(results);
    setView('result');
    window.location.hash = '/result';
    
    // Tracking (Simulated)
    console.log('Lead Captured:', data);
    console.log('Results Generated:', results);
    console.log('UTM context:', utm);
  };

  const startWizard = () => {
    setView('wizard');
    window.location.hash = '/wizard';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-white">
        <Routes>
          <Route path="/" element={
            view === 'landing' ? <Landing onStart={startWizard} /> :
            view === 'wizard' ? <Wizard onComplete={handleWizardComplete} /> :
            (leadData && scoring) ? <Result data={leadData} results={scoring} /> : <Landing onStart={startWizard} />
          } />
          <Route path="/wizard" element={<Wizard onComplete={handleWizardComplete} />} />
          <Route path="/result" element={
            (leadData && scoring) ? <Result data={leadData} results={scoring} /> : <Landing onStart={startWizard} />
          } />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <MainApp />
    </Router>
  );
};

export default App;
