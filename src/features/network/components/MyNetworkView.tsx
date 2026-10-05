"use client";

import React, { useState } from "react";
import {
  Compass,
  Users,
  UserCheck,
  UserPlus,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Building2,
  ExternalLink,
  MessageSquare,
  Check,
  Clock,
  MoreVertical,
  Layers,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { NetworkContact, RelationshipStage } from "../types/network.types";

interface MyNetworkViewProps {
  contacts: NetworkContact[];
  recommended: NetworkContact[];
  connections: NetworkContact[];
  following: NetworkContact[];
  followers: NetworkContact[];
  onSelectContact: (contact: NetworkContact) => void;
  onToggleConnect: (contactId: string) => void;
  onToggleFollow: (contactId: string) => void;
  onOpenAddModal: () => void;
}

export function MyNetworkView({
  contacts,
  recommended,
  connections,
  following,
  followers,
  onSelectContact,
  onToggleConnect,
  onToggleFollow,
  onOpenAddModal,
}: MyNetworkViewProps) {
  const [subTab, setSubTab] = useState<"grow" | "connections" | "following">("grow");
  const [followSubTab, setFollowSubTab] = useState<"following" | "followers">("following");
  const [connSearch, setConnSearch] = useState("");
  const [connIndustry, setConnIndustry] = useState("all");

  const filteredConnections = connections.filter((conn) => {
    const matchesSearch =
      connSearch === "" ||
      conn.name.toLowerCase().includes(connSearch.toLowerCase()) ||
      conn.company.toLowerCase().includes(connSearch.toLowerCase()) ||
      conn.jobTitle.toLowerCase().includes(connSearch.toLowerCase()) ||
      conn.location.toLowerCase().includes(connSearch.toLowerCase());

    const matchesIndustry =
      connIndustry === "all" || conn.industry.toLowerCase().includes(connIndustry.toLowerCase());

    return matchesSearch && matchesIndustry;
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Sub navigation bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-surface border border-border">
        <div className="inline-flex p-1 rounded-xl bg-surface-alt border border-border">
          <button
            type="button"
            onClick={() => setSubTab("grow")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
              subTab === "grow"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-ink-soft hover:text-ink hover:bg-surface"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Grow Network</span>
            <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded-full bg-white/20">
              {recommended.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("connections")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
              subTab === "connections"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-ink-soft hover:text-ink hover:bg-surface"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>My Connections</span>
            <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded-full bg-white/20">
              {connections.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("following")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
              subTab === "following"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-ink-soft hover:text-ink hover:bg-surface"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Following & Followers</span>
            <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded-full bg-white/20">
              {following.length + followers.length}
            </span>
          </button>
        </div>

        <div className="text-xs text-ink-soft px-2">
          {subTab === "grow" && "Suggested connections based on your industry & role match"}
          {subTab === "connections" && `${connections.length} 1st-degree verified connections`}
          {subTab === "following" && "Manage creators, leaders and peers you track"}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 1. GROW NETWORK (DISCOVERY GRID)                      */}
      {/* ==================================================== */}
      {subTab === "grow" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-surface to-surface-alt border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary-glow" />
                <h2 className="text-base sm:text-lg font-bold text-ink">
                  Grow Your Professional Network
                </h2>
              </div>
              <p className="text-xs text-ink-soft">
                Discover professionals relevant to your career, startup, industry and goals.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition self-start sm:self-auto cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite by Email</span>
            </button>
          </div>

          {/* Grid of Recommendation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recommended.map((person) => {
              const isPending = person.connectionStatus === "pending";
              const isConnected = person.connectionStatus === "connected";

              return (
                <div
                  key={person._id}
                  className="rounded-2xl bg-surface border border-border overflow-hidden hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Card Banner Header */}
                  <div className="h-16 bg-gradient-to-r from-primary-deep via-primary to-primary-glow relative p-2">
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/40 text-white backdrop-blur-xs">
                      {person.connectionDegree || "2nd"}
                    </span>
                  </div>

                  {/* Profile info */}
                  <div className="px-4 pb-4 pt-0 -mt-8 flex-1 flex flex-col">
                    <div className="flex items-end justify-between mb-2">
                      <div className="relative">
                        {person.avatarUrl ? (
                          <img
                            src={person.avatarUrl}
                            alt={person.name}
                            className="w-16 h-16 rounded-full object-cover border-4 border-surface shadow-xs"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary-glow font-black text-base flex items-center justify-center border-4 border-surface shadow-xs">
                            {getInitials(person.name)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 mb-3">
                      <h3
                        onClick={() => onSelectContact(person)}
                        className="text-sm font-bold text-ink hover:text-primary-glow transition cursor-pointer line-clamp-1"
                      >
                        {person.name}
                      </h3>
                      <p className="text-xs font-medium text-ink-soft line-clamp-2">
                        {person.jobTitle} at{" "}
                        <span className="font-semibold text-ink">{person.company}</span>
                      </p>
                      <p className="text-[11px] text-ink-soft/80 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{person.location}</span>
                      </p>
                    </div>

                    {/* Mutual & Suggested Reason Badge */}
                    <div className="space-y-1.5 my-2">
                      {person.mutualConnections > 0 && (
                        <p className="text-[11px] text-ink-soft font-medium flex items-center gap-1">
                          <Users className="w-3 h-3 text-primary-glow" />
                          <span>{person.mutualConnections} mutual connections</span>
                        </p>
                      )}

                      {person.recommendationReason && (
                        <div className="p-2 rounded-xl bg-surface-alt border border-border/80">
                          <p className="text-[10px] text-ink-soft leading-tight">
                            <span className="font-semibold text-ink block mb-0.5">
                              Suggested because:
                            </span>
                            "{person.recommendationReason}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-border mt-auto space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Connect / Pending / Connected Button */}
                        <button
                          type="button"
                          onClick={() => onToggleConnect(person._id)}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                            isConnected
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : isPending
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-primary text-primary-foreground hover:bg-primary/90"
                          }`}
                        >
                          {isConnected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Connected</span>
                            </>
                          ) : isPending ? (
                            <>
                              <Clock className="w-3.5 h-3.5 animate-spin" />
                              <span>Pending</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Connect</span>
                            </>
                          )}
                        </button>

                        {/* Follow Button */}
                        <button
                          type="button"
                          onClick={() => onToggleFollow(person._id)}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                            person.isFollowing
                              ? "bg-surface-alt border-primary/30 text-primary-glow"
                              : "bg-surface border-border text-ink hover:bg-surface-alt"
                          }`}
                        >
                          {person.isFollowing ? "Following" : "Follow"}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectContact(person)}
                        className="w-full text-center py-1 text-[11px] font-semibold text-ink-soft hover:text-ink transition cursor-pointer"
                      >
                        View Full Profile
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. MY CONNECTIONS                                    */}
      {/* ==================================================== */}
      {subTab === "connections" && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface border border-border">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={connSearch}
                onChange={(e) => setConnSearch(e.target.value)}
                placeholder="Search by name, job title, company, or city..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={connIndustry}
                onChange={(e) => setConnIndustry(e.target.value)}
                className="px-3 py-2 text-xs font-medium rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition cursor-pointer"
              >
                <option value="all">All Industries</option>
                <option value="Technology">Technology & AI</option>
                <option value="Enterprise">Enterprise Software</option>
                <option value="Venture">Venture Capital</option>
                <option value="FinTech">Financial Tech</option>
              </select>

              <span className="text-xs font-bold text-ink-soft px-2">
                {filteredConnections.length} Connections
              </span>
            </div>
          </div>

          {/* Connections List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredConnections.map((conn) => (
              <div
                key={conn._id}
                className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    {conn.avatarUrl ? (
                      <img
                        src={conn.avatarUrl}
                        alt={conn.name}
                        className="w-12 h-12 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary-glow font-bold text-sm flex items-center justify-center border border-primary/20">
                        {getInitials(conn.name)}
                      </div>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-surface" />
                  </div>

                  <div className="min-w-0">
                    <h4
                      onClick={() => onSelectContact(conn)}
                      className="text-sm font-bold text-ink hover:text-primary-glow transition cursor-pointer truncate"
                    >
                      {conn.name}
                    </h4>
                    <p className="text-xs font-medium text-ink-soft truncate">
                      {conn.jobTitle} • {conn.company}
                    </p>
                    <p className="text-[11px] text-ink-soft/80 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{conn.location}</span>
                      <span>•</span>
                      <span>{conn.industry}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectContact(conn)}
                    className="p-2 rounded-xl bg-surface-alt hover:bg-primary/10 hover:text-primary-glow text-ink-soft border border-border transition cursor-pointer"
                    title="Send Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectContact(conn)}
                    className="px-3 py-1.5 rounded-xl bg-surface-alt hover:bg-surface text-xs font-bold text-ink border border-border transition cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}

            {filteredConnections.length === 0 && (
              <div className="col-span-full p-8 text-center bg-surface rounded-2xl border border-dashed border-border text-ink-soft">
                <p className="text-sm font-medium">No connections match your query.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. FOLLOWING & FOLLOWERS                             */}
      {/* ==================================================== */}
      {subTab === "following" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <button
              type="button"
              onClick={() => setFollowSubTab("following")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                followSubTab === "following"
                  ? "bg-primary text-primary-foreground"
                  : "text-ink-soft hover:text-ink hover:bg-surface-alt"
              }`}
            >
              Following ({following.length})
            </button>
            <button
              type="button"
              onClick={() => setFollowSubTab("followers")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                followSubTab === "followers"
                  ? "bg-primary text-primary-foreground"
                  : "text-ink-soft hover:text-ink hover:bg-surface-alt"
              }`}
            >
              Followers ({followers.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(followSubTab === "following" ? following : followers).map((person) => (
              <div
                key={person._id}
                className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {person.avatarUrl ? (
                    <img
                      src={person.avatarUrl}
                      alt={person.name}
                      className="w-11 h-11 rounded-full object-cover border border-border shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-primary/10 text-primary-glow font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0">
                      {getInitials(person.name)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4
                      onClick={() => onSelectContact(person)}
                      className="text-xs sm:text-sm font-bold text-ink hover:text-primary-glow transition cursor-pointer truncate"
                    >
                      {person.name}
                    </h4>
                    <p className="text-[11px] text-ink-soft truncate">
                      {person.jobTitle} • {person.company}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleFollow(person._id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer shrink-0 ${
                    person.isFollowing
                      ? "bg-surface-alt border-primary/30 text-primary-glow"
                      : "bg-surface border-border text-ink hover:bg-surface-alt"
                  }`}
                >
                  {person.isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
