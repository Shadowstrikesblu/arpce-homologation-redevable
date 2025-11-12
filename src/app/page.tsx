"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Plus,
  TrendingUp,
  BarChart3,
  ArrowRight
} from 'lucide-react';

const statsData = {
  total: 24,
  success: 18,
  failed: 3,
  inProgress: 3
};

const notificationsData = [
  {
    id: 1,
    type: 'success',
    title: 'Homologation validée',
    message: 'Votre demande HOM-2024-015 a été approuvée',
    time: 'Il y a 2 heures',
    read: false
  },
  {
    id: 2,
    type: 'info',
    title: 'Document requis',
    message: 'Des documents supplémentaires sont nécessaires pour HOM-2024-018',
    time: 'Il y a 1 jour',
    read: false
  },
  {
    id: 3,
    type: 'warning',
    title: 'Délai approchant',
    message: 'La demande HOM-2024-016 expire dans 3 jours',
    time: 'Il y a 2 jours',
    read: true
  },
  {
    id: 4,
    type: 'success',
    title: 'Certificat disponible',
    message: 'Le certificat pour HOM-2024-014 est maintenant téléchargeable',
    time: 'Il y a 3 jours',
    read: true
  }
];

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(notificationsData);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulation du chargement des données
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    calculateUnreadCount();
  }, []);

  const calculateUnreadCount = () => {
    const unread = notifications.filter(notif => !notif.read).length;
    setUnreadCount(unread);
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-amber-500';
      case 'info':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#af3338] border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-[#af3338] to-[#c9454a] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold">Tableau de bord</h1>
              <p className="text-white/80 mt-1">Bienvenue sur votre portail d'homologation</p>
            </div>
            
            <Button
              onClick={() => router.push('/nouvelle-demande')}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-6 py-3 font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle demande d'homologation
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <TrendingUp className="h-6 w-6 mr-3 text-[#af3338]" />
              Aperçu des demandes
            </h2>
            <Button
              onClick={() => router.push('/projets')}
              variant="outline"
              className="border-[#8ba755] text-[#8ba755] hover:bg-[#8ba755] hover:text-white"
            >
              Voir tous les projets
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border-l-4 border-l-[#af3338] hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Total des demandes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-[#af3338]">{statsData.total}</p>
                  <BarChart3 className="h-8 w-8 text-gray-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-[#8ba755] hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-[#8ba755]" />
                  Demandes validées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-[#8ba755]">{statsData.success}</p>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {Math.round((statsData.success / statsData.total) * 100)}% de te
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-500" />
                  En cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-amber-600">{statsData.inProgress}</p>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    En traitement
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-red-500 hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                  Demandes rejetées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-red-600">{statsData.failed}</p>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {Math.round((statsData.failed / statsData.total) * 100)}% d'échec
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="h-6 w-6 mr-3 text-[#af3338]" />
            Actions rapides
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
              className="bg-white hover:shadow-lg transition-all duration-200 border border-gray-200 cursor-pointer hover:border-[#af3338] hover:scale-105"
              onClick={() => router.push('/nouvelle-demande')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-[#af3338] p-3 rounded-lg mr-4">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Nouvelle demande</h3>
                      <p className="text-sm text-gray-600">Soumettre une nouvelle demande d'homologation</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-white hover:shadow-lg transition-all duration-200 border border-gray-200 cursor-pointer hover:border-[#8ba755] hover:scale-105"
              onClick={() => router.push('/projets')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-[#8ba755] p-3 rounded-lg mr-4">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Mes projets</h3>
                      <p className="text-sm text-gray-600">Consulter l'historique de mes demandes</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Bell className="h-6 w-6 mr-3 text-[#af3338]" />
              Notifications récentes
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-[#af3338] text-white">
                  {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
                </Badge>
              )}
            </h2>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="ghost"
                className="text-sm text-[#8ba755] hover:text-[#7a9648]"
              >
                Tout marquer comme lu
              </Button>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-6 hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-800 text-base">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-3 h-3 bg-[#af3338] rounded-full"></div>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Aucune notification pour le moment</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Les nouvelles notifications apparaîtront ici
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}