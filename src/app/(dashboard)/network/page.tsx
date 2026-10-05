"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import { NetworkHeader } from "@/features/network/components/NetworkHeader";
import { NetworkSummaryCards } from "@/features/network/components/NetworkSummaryCards";
import { NetworkToolbar } from "@/features/network/components/NetworkToolbar";
import { NetworkKanbanBoard } from "@/features/network/components/NetworkKanbanBoard";
import { MyNetworkView } from "@/features/network/components/MyNetworkView";
import { NetworkActivityFeed } from "@/features/network/components/NetworkActivityFeed";
import { NetworkInsightsSidebar } from "@/features/network/components/NetworkInsightsSidebar";
import { ProfileRelationshipDrawer } from "@/features/network/components/ProfileRelationshipDrawer";
import { AddContactModal } from "@/features/network/components/AddContactModal";
import { networkService } from "@/features/network/services/networkService";
import {
  NetworkContact,
  NetworkSummary,
  NetworkActivity,
  NetworkFilters,
  RelationshipStage,
} from "@/features/network/types/network.types";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<"kanban" | "network">("kanban");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data states
  const [contacts, setContacts] = useState<NetworkContact[]>([]);
  const [summary, setSummary] = useState<NetworkSummary | null>(null);
  const [recommended, setRecommended] = useState<NetworkContact[]>([]);
  const [connections, setConnections] = useState<NetworkContact[]>([]);
  const [following, setFollowing] = useState<NetworkContact[]>([]);
  const [followers, setFollowers] = useState<NetworkContact[]>([]);
  const [activities, setActivities] = useState<NetworkActivity[]>([]);

  // Drawer & Modal states
  const [selectedContact, setSelectedContact] = useState<NetworkContact | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalDefaultStage, setAddModalDefaultStage] = useState<RelationshipStage>("discover");

  // Filters state
  const [filters, setFilters] = useState<NetworkFilters>({
    search: "",
    stage: "all",
    industry: "all",
    location: "all",
    source: "all",
    sort: "recent",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load all initial network data
  const loadData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      else setRefreshing(true);
      setError(null);

      const [summaryRes, contactsRes, recommendedRes, connectionsRes, followRes, activityRes] =
        await Promise.all([
          networkService.getSummary(),
          networkService.getContacts(filters),
          networkService.getRecommended(),
          networkService.getConnections(),
          networkService.getFollowingAndFollowers(),
          networkService.getActivityFeed(),
        ]);

      setSummary(summaryRes);
      setContacts(contactsRes.contacts || []);
      setRecommended(recommendedRes || []);
      setConnections(connectionsRes || []);
      setFollowing(followRes.following || []);
      setFollowers(followRes.followers || []);
      setActivities(activityRes || []);
    } catch (err: any) {
      console.error("Failed to load network data:", err);
      setError("Unable to sync network data. Retrying with local state.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered contacts based on toolbar state
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch =
        filters.search === "" ||
        c.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.jobTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        (c.tags && c.tags.some((t) => t.toLowerCase().includes(filters.search.toLowerCase())));

      const matchesStage = filters.stage === "all" || c.relationshipStage === filters.stage;
      const matchesIndustry =
        filters.industry === "all" ||
        c.industry.toLowerCase().includes(filters.industry.toLowerCase());
      const matchesLocation =
        filters.location === "all" ||
        c.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesSource =
        filters.source === "all" ||
        c.source.toLowerCase().includes(filters.source.toLowerCase());

      return matchesSearch && matchesStage && matchesIndustry && matchesLocation && matchesSource;
    });
  }, [contacts, filters]);

  // Stage move handler with optimistic UI update
  const handleMoveStage = async (contactId: string, targetStage: RelationshipStage) => {
    const prevContacts = [...contacts];

    // Optimistically update
    setContacts((prev) =>
      prev.map((c) =>
        c._id === contactId
          ? {
              ...c,
              relationshipStage: targetStage,
              interactionHistory: [
                {
                  id: `int-${Date.now()}`,
                  type: "stage_change",
                  description: `Moved stage to ${targetStage.toUpperCase()}`,
                  date: new Date().toISOString(),
                },
                ...(c.interactionHistory || []),
              ],
            }
          : c
      )
    );

    if (selectedContact && selectedContact._id === contactId) {
      setSelectedContact((prev) => (prev ? { ...prev, relationshipStage: targetStage } : null));
    }

    try {
      const updated = await networkService.updateStage(contactId, targetStage);
      showToast(`Moved ${updated.name} to ${targetStage.toUpperCase()}`);
      // Refresh summary in background
      networkService.getSummary().then(setSummary).catch(console.warn);
      networkService.getActivityFeed().then(setActivities).catch(console.warn);
    } catch (err) {
      console.error("Failed to persist stage move:", err);
      setContacts(prevContacts);
      showToast("Could not update stage. Reverted changes.");
    }
  };

  // Toggle connection request
  const handleToggleConnect = async (contactId: string) => {
    try {
      const updated = await networkService.toggleConnect(contactId);
      setContacts((prev) => prev.map((c) => (c._id === contactId ? updated : c)));
      setRecommended((prev) => prev.map((c) => (c._id === contactId ? updated : c)));
      if (selectedContact && selectedContact._id === contactId) {
        setSelectedContact(updated);
      }
      showToast(
        updated.connectionStatus === "connected"
          ? `Connected with ${updated.name}!`
          : updated.connectionStatus === "pending"
          ? `Invitation sent to ${updated.name}`
          : `Connection removed with ${updated.name}`
      );
      // Reload connections list
      networkService.getConnections().then(setConnections).catch(console.warn);
      networkService.getSummary().then(setSummary).catch(console.warn);
      networkService.getActivityFeed().then(setActivities).catch(console.warn);
    } catch (err) {
      console.error("Connect toggle error:", err);
      showToast("Unable to update connection status");
    }
  };

  // Toggle follow status
  const handleToggleFollow = async (contactId: string) => {
    try {
      const updated = await networkService.toggleFollow(contactId);
      setContacts((prev) => prev.map((c) => (c._id === contactId ? updated : c)));
      setRecommended((prev) => prev.map((c) => (c._id === contactId ? updated : c)));
      if (selectedContact && selectedContact._id === contactId) {
        setSelectedContact(updated);
      }
      showToast(updated.isFollowing ? `Now following ${updated.name}` : `Unfollowed ${updated.name}`);
      networkService.getFollowingAndFollowers().then((res) => {
        setFollowing(res.following);
        setFollowers(res.followers);
      }).catch(console.warn);
    } catch (err) {
      console.error("Follow toggle error:", err);
      showToast("Unable to toggle follow");
    }
  };

  // Add note or interaction
  const handleAddInteraction = async (
    type: "message" | "meeting" | "note",
    description: string
  ) => {
    if (!selectedContact) return;
    try {
      const updated = await networkService.addInteraction(selectedContact._id, {
        type,
        description,
      });
      setSelectedContact(updated);
      setContacts((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      showToast("Recorded interaction note");
    } catch (err) {
      console.error("Add interaction error:", err);
      showToast("Unable to record interaction");
    }
  };

  // Delete contact
  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    try {
      await networkService.deleteContact(selectedContact._id);
      setContacts((prev) => prev.filter((c) => c._id !== selectedContact._id));
      setConnections((prev) => prev.filter((c) => c._id !== selectedContact._id));
      setIsDrawerOpen(false);
      setSelectedContact(null);
      showToast("Contact removed from network");
      networkService.getSummary().then(setSummary).catch(console.warn);
    } catch (err) {
      console.error("Delete contact error:", err);
      showToast("Unable to remove contact");
    }
  };

  // Create new contact from modal
  const handleAddContactSubmit = async (data: Partial<NetworkContact>) => {
    const created = await networkService.createContact(data);
    setContacts((prev) => [created, ...prev]);
    showToast(`Added ${created.name} to ${created.relationshipStage.toUpperCase()} stage`);
    networkService.getSummary().then(setSummary).catch(console.warn);
    networkService.getActivityFeed().then(setActivities).catch(console.warn);
  };

  const handleOpenAddModal = (stage: RelationshipStage = "discover") => {
    setAddModalDefaultStage(stage);
    setIsAddModalOpen(true);
  };

  const handleSelectContact = (contact: NetworkContact) => {
    setSelectedContact(contact);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-surface px-4 py-3 rounded-2xl shadow-xl border border-border/20 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Segmented Tab Switcher */}
      <NetworkHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddModal={() => handleOpenAddModal("discover")}
        totalNetworkCount={summary?.totalNetwork || contacts.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadData()}
              className="font-bold underline hover:no-underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Section 1: Summary Metric Cards */}
        <NetworkSummaryCards summary={summary} loading={loading} />

        {/* Main Content Sections */}
        {loading ? (
          <div className="space-y-4 pt-4">
            <Skeleton className="w-full h-14 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* SECTION 1: KANBAN FUNNEL */}
            {activeTab === "kanban" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Toolbar */}
                <NetworkToolbar
                  filters={filters}
                  onFilterChange={(updates) => setFilters((prev) => ({ ...prev, ...updates }))}
                  onResetFilters={() =>
                    setFilters({
                      search: "",
                      stage: "all",
                      industry: "all",
                      location: "all",
                      source: "all",
                      sort: "recent",
                    })
                  }
                  onOpenAddModal={() => handleOpenAddModal("discover")}
                  totalFilteredCount={filteredContacts.length}
                />

                {/* 6-Column Kanban Board */}
                <NetworkKanbanBoard
                  contacts={filteredContacts}
                  onSelectContact={handleSelectContact}
                  onMoveStage={handleMoveStage}
                  onOpenAddModal={handleOpenAddModal}
                />

                {/* Secondary Row: Activity Feed & Sidebar Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                  <div className="lg:col-span-2">
                    <NetworkActivityFeed activities={activities} />
                  </div>
                  <div>
                    <NetworkInsightsSidebar
                      summary={summary}
                      recommended={recommended}
                      onSelectContact={handleSelectContact}
                      onToggleConnect={handleToggleConnect}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: LINKEDIN NETWORK + MY NETWORK */}
            {activeTab === "network" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
                {/* Left/Main Column: Grow Network / Connections / Following */}
                <div className="lg:col-span-2 space-y-6">
                  <MyNetworkView
                    contacts={contacts}
                    recommended={recommended}
                    connections={connections}
                    following={following}
                    followers={followers}
                    onSelectContact={handleSelectContact}
                    onToggleConnect={handleToggleConnect}
                    onToggleFollow={handleToggleFollow}
                    onOpenAddModal={() => handleOpenAddModal("discover")}
                  />

                  <NetworkActivityFeed activities={activities} />
                </div>

                {/* Right Column: Insights & Quick Previews */}
                <div className="space-y-6">
                  <NetworkInsightsSidebar
                    summary={summary}
                    recommended={recommended}
                    onSelectContact={handleSelectContact}
                    onToggleConnect={handleToggleConnect}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Profile / Relationship Drawer */}
      <ProfileRelationshipDrawer
        contact={selectedContact}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedContact(null);
        }}
        onUpdateStage={(newStage) => {
          if (selectedContact) {
            handleMoveStage(selectedContact._id, newStage);
          }
        }}
        onToggleConnect={() => {
          if (selectedContact) {
            handleToggleConnect(selectedContact._id);
          }
        }}
        onToggleFollow={() => {
          if (selectedContact) {
            handleToggleFollow(selectedContact._id);
          }
        }}
        onAddInteraction={handleAddInteraction}
        onDeleteContact={handleDeleteContact}
      />

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultStage={addModalDefaultStage}
        onSubmit={handleAddContactSubmit}
      />
    </div>
  );
}
