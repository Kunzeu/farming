'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import { useI18n } from '@/contexts/I18nContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Gift, 
  Calendar, 
  Users, 
  Gem, 
  Trophy, 
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Star,
  Award,
  Crown,
  Shield,
  BookOpen,
  ChevronRight,
  X,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';

interface Giveaway {
  id: string;
  title: string;
  description: string;
  prizes: Array<{
    position: number;
    prize: string;
    icon: string;
  }>;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'ended';
  participants: number;
  maxParticipants?: number;
  requirements: string[];
  rules: string[];
}

interface AccountInfo {
  id: string;
  name: string;
}

interface Participant {
  id: string;
  giveawayId: string;
  userId: string;
  accountName: string;
  participatedAt: string;
}

const mockGiveaways: Giveaway[] = [
  {
    id: 'October-2025',
    title: 'October Gem Giveaway', // This will be replaced with translation in the component
    description: 'Our first community giveaway! Win amazing in-game prizes including gem codes and materials!', // This will be replaced with translation in the component
    prizes: [
      { position: 1, prize: '1200 Gems', icon: 'gem' },
      { position: 2, prize: '800 Gems', icon: 'gem' },
      { position: 3, prize: '400 Gems', icon: 'gem' },
      { position: 4, prize: '400 Gems', icon: 'gem' },
      { position: 5, prize: '250', icon: 'package' },
      { position: 6, prize: '250', icon: 'package' },
      { position: 7, prize: '250', icon: 'package' },
      { position: 8, prize: '250', icon: 'package' },
      { position: 9, prize: '250', icon: 'package' },
      { position: 10, prize: '250', icon: 'package' }
    ],
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    status: 'active',
    participants: 0,
    requirements: [
      'Link your GW2 API key to your account',
      'Join our Discord server',
      'Follow us on social media'
    ],
    rules: [
      'One entry per person',
      'Must have valid GW2 account',
      'API key must be active during the entire giveaway period',
      'Winners will be selected randomly',
      'Prizes will be delivered within 48 hours'
    ]
  },
];

const GiveawaysPage = () => {
  const { t } = useI18n();
  const { isAuthenticated, user } = useAuth();
  usePageTitle('pageTitles.giveaways', t('giveaways.title'));
  
  // Create translated giveaways
  const getTranslatedGiveaways = (): Giveaway[] => {
    return mockGiveaways.map(giveaway => ({
      ...giveaway,
      title: giveaway.id === 'October-2025' ? t('giveaways.october2025.title') : giveaway.title,
      description: giveaway.id === 'October-2025' ? t('giveaways.october2025.description') : giveaway.description
    }));
  };
  
  const [giveaways, setGiveaways] = useState<Giveaway[]>(getTranslatedGiveaways());
  const [selectedGiveaway, setSelectedGiveaway] = useState<Giveaway | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [showParticipationSuccess, setShowParticipationSuccess] = useState(false);
  const [participatedAccounts, setParticipatedAccounts] = useState<Set<string>>(new Set());

  // Load participant counts for giveaways
  const loadParticipantCounts = async () => {
    try {
      const translatedGiveaways = getTranslatedGiveaways();
      const updatedGiveaways = await Promise.all(
        translatedGiveaways.map(async (giveaway) => {
          try {
            const response = await fetch(`/api/giveaways/count?giveawayId=${giveaway.id}`);
            if (response.ok) {
              const data = await response.json();
              return { ...giveaway, participants: data.count };
            }
          } catch (error) {
            console.error(`Error loading count for giveaway ${giveaway.id}:`, error);
          }
          return giveaway;
        })
      );
      setGiveaways(updatedGiveaways);
    } catch (error) {
      console.error('Error loading participant counts:', error);
    }
  };

  // Load user's participated giveaways
  const loadParticipatedGiveaways = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/giveaways/participants?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        const participatedSet = new Set(data.participants.map((p: Participant) => p.giveawayId));
        setParticipatedAccounts(participatedSet as Set<string>);
      }
    } catch (error) {
      console.error('Error loading participated giveaways:', error);
    }
  };

  // Check if user has API key and get account info from database
  useEffect(() => {
    const checkApiKey = async () => {
      if (!isAuthenticated || !user?.id) {
        setHasApiKey(false);
        setApiKeyValid(false);
        return;
      }

      try {
        // Get API key from database
        const response = await fetch(`/api/users/${user.id}/api-key?user_id=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setHasApiKey(data.hasApiKey);
          
          if (data.hasApiKey) {
            // Validate API key and get account info
            const validateResponse = await fetch(`/api/users/${user.id}/validate-api?user_id=${user.id}`, {
              method: 'POST'
            });
            
            if (validateResponse.ok) {
              const validateData = await validateResponse.json();
              setApiKeyValid(validateData.valid);
              if (validateData.valid && validateData.accountInfo) {
                setAccountInfo(validateData.accountInfo);
              }
            } else {
              setApiKeyValid(false);
            }
          } else {
            setApiKeyValid(false);
          }
        } else {
          setHasApiKey(false);
          setApiKeyValid(false);
        }
      } catch (error) {
        console.error('Error checking API key:', error);
        setHasApiKey(false);
        setApiKeyValid(false);
      }
    };

    checkApiKey();
  }, [isAuthenticated, user?.id]);

  // Update giveaways when language changes
  useEffect(() => {
    setGiveaways(getTranslatedGiveaways());
  }, [t]);

  // Load participant counts and user's participated giveaways on component mount
  useEffect(() => {
    loadParticipantCounts();
    loadParticipatedGiveaways();
  }, [user?.id]);


  // Update participant count based on actual participants
  useEffect(() => {
    setParticipantCount(participatedAccounts.size);
  }, [participatedAccounts]);

  // Update the active giveaway's participant count
  useEffect(() => {
    setGiveaways(prev => prev.map(giveaway => 
      giveaway.status === 'active' 
        ? { ...giveaway, participants: participantCount }
        : giveaway
    ));
  }, [participantCount]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900/20';
      case 'upcoming': return 'text-blue-400 bg-blue-900/20';
      case 'ended': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'ended': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPrizeIcon = (icon: string) => {
    switch (icon) {
      case 'gem': return <Gem className="w-4 h-4 text-yellow-400" />;
      case 'package': return <Gift className="w-4 h-4 text-blue-400" />;
      default: return <Gift className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Crown className="w-4 h-4 text-yellow-400" />;
    if (position === 2) return <Award className="w-4 h-4 text-gray-300" />;
    if (position === 3) return <Award className="w-4 h-4 text-amber-600" />;
    return <Star className="w-4 h-4 text-gray-400" />;
  };

  const handleEnterGiveaway = async () => {
    if (!isAuthenticated || !user?.id) {
      window.location.href = '/auth/login';
      return;
    }
    
    if (!hasApiKey || !apiKeyValid) {
      window.location.href = '/profile';
      return;
    }

    if (!accountInfo) {
      alert('Account information not available. Please try again.');
      return;
    }

    if (!selectedGiveaway) return;

    const accountName = accountInfo.name;
    const giveawayId = selectedGiveaway.id;
    
    // Check if user already participated
    if (participatedAccounts.has(giveawayId)) {
      alert('You have already entered this giveaway!');
      return;
    }
    
    try {
      const response = await fetch('/api/giveaways/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          giveawayId: giveawayId,
          userId: user.id,
          accountName: accountName
        }),
      });

      if (response.ok) {
        // Add to participated accounts
        const newParticipatedAccounts = new Set(participatedAccounts);
        newParticipatedAccounts.add(giveawayId);
        setParticipatedAccounts(newParticipatedAccounts);

        // Reload participant counts to update the display
        loadParticipantCounts();

        // Show success modal
        setShowParticipationSuccess(true);
        setSelectedGiveaway(null);
      } else {
        const errorData = await response.json();
        console.error('Error participating in giveaway:', errorData);
        alert('Error participating in giveaway. Please try again.');
      }
    } catch (error) {
      console.error('Error participating in giveaway:', error);
      alert('Error participating in giveaway. Please try again.');
    }
  };

  const activeGiveaway = giveaways.find(g => g.status === 'active');
  const totalParticipants = giveaways.reduce((sum, g) => sum + g.participants, 0);
  const totalPrizes = giveaways.reduce((sum, g) => sum + g.prizes.length, 0);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">{t('giveaways.title')}</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t('giveaways.subtitle')}
          </p>
        </div>

        {/* Current Giveaway */}
        {activeGiveaway && (
          <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/20 text-green-400 text-sm font-medium mb-4">
                <CheckCircle className="w-4 h-4" />
                {t('giveaways.currentlyActive')}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{activeGiveaway.title}</h2>
              <p className="text-gray-300 text-lg">{activeGiveaway.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {activeGiveaway.participants.toLocaleString()}
                </div>
                <div className="text-gray-400">{t('giveaways.participants')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {activeGiveaway.prizes.length}
                </div>
                <div className="text-gray-400">{t('giveaways.prizes')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {Math.ceil((new Date(activeGiveaway.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-gray-400">{t('giveaways.daysLeft')}</div>
              </div>
            </div>

            {/* Prizes */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">{t('giveaways.prizes')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGiveaway.prizes.map((prize) => (
                  <div key={prize.position} className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-bold flex items-center justify-center">
                      {prize.position}
                    </div>
                    <div className="flex items-center gap-2">
                      {getPrizeIcon(prize.icon)}
                      <span className="font-medium text-white">{prize.prize}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Participation */}
            <div className="text-center">
              {!isAuthenticated ? (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  {t('giveaways.loginToParticipate')}
                </Link>
              ) : !hasApiKey || !apiKeyValid ? (
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  {hasApiKey ? t('giveaways.fixApiKeyToParticipate') : t('giveaways.addApiKeyToParticipate')}
                </Link>
              ) : (
                <button
                  onClick={() => setSelectedGiveaway(activeGiveaway)}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  <Gift className="w-5 h-5" />
                  {t('giveaways.enterGiveaway')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Giveaways */}
        {giveaways.filter(g => g.status === 'upcoming').length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">{t('giveaways.upcomingGiveaways')}</h2>
            <div className="space-y-4">
              {giveaways.filter(g => g.status === 'upcoming').map((giveaway) => (
                <div key={giveaway.id} className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{giveaway.title}</h3>
                      <p className="text-gray-300">{giveaway.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span>{t('giveaways.starts')} {new Date(giveaway.startDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{giveaway.prizes.length} {t('giveaways.prizes')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 text-blue-400 text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        {t('giveaways.upcoming')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Selected Giveaway Modal */}
        {selectedGiveaway && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedGiveaway(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-700 rounded-2xl p-8"
            >
              <button
                onClick={() => setSelectedGiveaway(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/20 text-green-400 text-sm font-medium mb-4">
                  <CheckCircle className="w-4 h-4" />
                  {t('giveaways.currentlyActive')}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedGiveaway.title}</h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                  {selectedGiveaway.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {selectedGiveaway.participants.toLocaleString()}
                    </div>
                    <div className="text-gray-400">{t('giveaways.participants')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {selectedGiveaway.prizes.length}
                    </div>
                    <div className="text-gray-400">{t('giveaways.prizes')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      {Math.ceil((new Date(selectedGiveaway.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-gray-400">{t('giveaways.daysLeft')}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Prizes */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">{t('giveaways.prizes')}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedGiveaway.prizes.map((prize) => (
                        <div key={prize.position} className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-bold flex items-center justify-center">
                            {prize.position}
                          </div>
                          <div className="flex items-center gap-2">
                            {getPrizeIcon(prize.icon)}
                            <span className="font-medium text-white">{prize.prize}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Enter Giveaway */}
                  <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">{t('giveaways.enterGiveaway')}</h3>
                    
                    <div className="space-y-4">
                      {selectedGiveaway.status === 'active' ? (
                        (() => {
                          const accountId = accountInfo?.id;
                          const hasParticipated = Boolean(accountId && participatedAccounts.has(accountId));
                          
                          return (
                            <button
                              onClick={handleEnterGiveaway}
                              disabled={hasParticipated}
                              className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors ${
                                hasParticipated
                                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                  : !isAuthenticated 
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : !hasApiKey || !apiKeyValid
                                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              {hasParticipated
                                ? t('giveaways.alreadyEntered')
                                : !isAuthenticated 
                                ? t('giveaways.loginToEnter')
                                : !hasApiKey 
                                ? t('giveaways.addApiKeyToEnter')
                                : !apiKeyValid
                                ? t('giveaways.fixApiKeyToEnter')
                                : t('giveaways.enterGiveawayButton')
                              }
                            </button>
                          );
                        })()
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-600 text-gray-400 font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
                        >
                          {selectedGiveaway.status === 'upcoming' ? t('giveaways.notStartedYet') : t('giveaways.giveawayEnded')}
                        </button>
                      )}
                      
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">
                          {selectedGiveaway.participants.toLocaleString()} {t('giveaways.participants')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">{t('giveaways.quickLinks')}</h3>
                    <div className="space-y-3">
                      <a
                        href="https://discord.com/invite/KQSrhA2qmx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 text-purple-400" />
                        <span className="text-white">{t('giveaways.joinDiscord')}</span>
                      </a>
                      
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors"
                      >
                        <Shield className="w-5 h-5 text-blue-400" />
                        <span className="text-white">{t('giveaways.linkApiKey')}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Participation Success Modal */}
        {showParticipationSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowParticipationSuccess(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-md w-[90%] bg-gray-900 border border-gray-700 rounded-2xl p-8"
            >
              <button
                onClick={() => setShowParticipationSuccess(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">{t('giveaways.successfullyEntered')}</h3>
                <p className="text-gray-300 mb-6">
                  {t('giveaways.successMessage')}
                </p>
                
                {accountInfo && (
                  <div className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-4 mb-6">
                    <h4 className="text-lg font-semibold text-white mb-2">{t('giveaways.accountInformation')}</h4>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {accountInfo.name || 'N/A'}
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        {t('giveaways.accountName')}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <button
                    onClick={() => setShowParticipationSuccess(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    {t('giveaways.close')}
                  </button>
                  
                  <a
                    href="https://discord.gg/your-discord"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-purple-600 text-purple-300 hover:bg-purple-700/20 font-medium py-2 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('giveaways.joinDiscordForUpdates')}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiveawaysPage;
