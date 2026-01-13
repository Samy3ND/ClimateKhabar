import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NotificationBell = ({ currentUser }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const audioRef = useRef(null); // Optional sound

    // Polling interval
    useEffect(() => {
        if (!currentUser) return;

        const fetchNotifications = async () => {
            try {
                const res = await fetch('/api/notifications');
                const data = await res.json();
                if (res.ok) {
                    setNotifications(data);
                    
                    // Simple logic: Count unread
                    const unread = data.filter(n => !n.isRead).length;
                    setUnreadCount(unread);

                    // Check for new alerts for system notification
                    // We compare with previous state if we want strict "newly arrived" logic, 
                    // or just check top one if it's very recent (e.g. last 1 min).
                    // For simplicity in this demo, we won't spam system notifications on every refresh,
                    // but we will ask for permission.
                    if (unread > 0 && Notification.permission === 'granted') {
                        // Logic to only notify if the top notification is new? 
                        // We'll store the ID of the last notified item in LocalStorage to avoid loops.
                        const lastNotifiedId = localStorage.getItem('lastNotifiedId');
                        const topNotif = data[0];
                        
                        if (topNotif && topNotif._id !== lastNotifiedId && !topNotif.isRead) {
                            new Notification(topNotif.title || 'New Notification', {
                                body: topNotif.message,
                                icon: '/logo192.png' // precise path depends on public folder
                            });
                            localStorage.setItem('lastNotifiedId', topNotif._id);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };

        // Initial fetch
        fetchNotifications();

        // Check permission
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }

        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [currentUser]);

    const handleMarkAsRead = async (id, link) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
            // Optimistically update UI
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await fetch(`/api/notifications/read-all`, { method: 'PUT' });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all read", error);
        }
    };

    if (!currentUser) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="relative cursor-pointer p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <Bell className={`h-6 w-6 ${unreadCount > 0 ? 'text-slate-700' : 'text-slate-500'}`} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 md:w-96 max-h-[500px] overflow-y-auto rounded-xl shadow-xl border border-slate-200" align="end">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 sticky top-0 backdrop-blur-md z-10 border-b border-slate-100">
                    <span className="font-bold text-slate-800 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                        <button 
                            onClick={(e) => { e.preventDefault(); handleMarkAllRead(); }}
                            className="text-xs text-emerald-600 font-medium hover:text-emerald-700 hover:underline"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
                
                <div className="py-1">
                    {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-slate-500 text-sm">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            No new notifications
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <DropdownMenuItem key={notif._id} className="p-0 focus:bg-slate-50 cursor-default">
                                <Link 
                                    to={notif.link} 
                                    onClick={() => handleMarkAsRead(notif._id)}
                                    className={`block w-full px-4 py-3 hover:bg-slate-50 transition-colors border-l-4 ${notif.isRead ? 'border-transparent opacity-60' : 'border-emerald-500 bg-emerald-50/10'}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-1">
                                            <span className={`flex h-2 w-2 rounded-full ${notif.isRead ? 'bg-slate-300' : 'bg-emerald-500'}`} />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className={`text-sm ${notif.isRead ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium mt-1">
                                                {new Date(notif.createdAt).toLocaleDateString()} • {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationBell;
