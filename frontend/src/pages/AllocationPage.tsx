import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Clock, CheckCircle, XCircle, ChevronRight, Loader2, Award, TrendingUp } from "lucide-react";
import { getPendingRequests, getSuggestedEmployees, confirmAllocation } from "../services/allocationService";
import { AllocationRequest, SuggestedEmployee } from "../types";
import { PriorityBadge } from "../components/PriorityBadge";
import { SkillBadge, SkillBadgeList } from "../components/SkillBadge";
import { StatusBadge } from "../components/StatusBadge";
import { UtilizationGauge } from "../components/UtilizationGauge";
import { cn } from "@/lib/utils";
import { useToast } from "../hooks/use-toast";

export function AllocationPage() {
  const [requests, setRequests] = useState<AllocationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AllocationRequest | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestedEmployee[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    getPendingRequests().then((data) => { setRequests(data); setLoadingRequests(false); });
  }, []);

  const handleSelectRequest = async (req: AllocationRequest) => {
    setSelectedRequest(req);
    setSuggestions([]);
    setLoadingSuggestions(true);
    const results = await getSuggestedEmployees(req.id);
    setSuggestions(results);
    setLoadingSuggestions(false);
  };

  const handleConfirm = async (empId: string) => {
    if (!selectedRequest) return;
    setConfirming(empId);
    try {
      await confirmAllocation(selectedRequest.id, empId);
      setConfirmed((prev) => new Set([...prev, empId]));
      toast({
        title: "Allocation Created",
        description: "The resource has been successfully allocated.",
      });
      // Refetch both suggestions and requests
      const newSuggestions = await getSuggestedEmployees(selectedRequest.id);
      setSuggestions(newSuggestions);
      const newRequests = await getPendingRequests();
      setRequests(newRequests);
    } catch (error: any) {
      toast({
        title: "Allocation Failed",
        description: error.response?.data?.message || "Could not allocate the resource due to an overallocation error.",
        variant: "destructive",
      });
    } finally {
      setConfirming(null);
    }
  };

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <h1 className="text-lg font-bold text-slate-900">Smart Allocation Engine</h1>
        </div>
        <p className="text-sm text-slate-500">AI-powered resource matching based on skills, experience, availability, and project fit</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 h-[calc(100vh-180px)]">
        {/* Left: Requests list */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">Pending Requests</h2>
            {!loadingRequests && (
              <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                {requests.length}
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {loadingRequests
              ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />
              ))
              : [...requests].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]).map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 2 }}
                  onClick={() => handleSelectRequest(req)}
                  data-testid={`req-card-${req.id}`}
                  className={cn(
                    "bg-white rounded-xl border p-4 cursor-pointer transition-all",
                    selectedRequest?.id === req.id
                      ? "border-indigo-400 ring-2 ring-indigo-100 shadow-sm"
                      : "border-slate-200 hover:border-indigo-200 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{req.role}</p>
                      <p className="text-xs text-slate-500 truncate">{req.projectName}</p>
                      <p className="text-xs text-indigo-600">{req.client}</p>
                    </div>
                    <PriorityBadge priority={req.priority} className="ml-2 flex-shrink-0" />
                  </div>
                  <SkillBadgeList skills={req.requiredSkills} max={3} />
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-400">{req.experienceNeeded}+ years</span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-400">Starts {req.startDate}</span>
                    {selectedRequest?.id === req.id && (
                      <ChevronRight className="h-3.5 w-3.5 text-indigo-500 ml-auto" />
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Right: Suggestions */}
        <div className="lg:col-span-3 flex flex-col">
          {!selectedRequest && (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-slate-200 text-center p-8">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                <Sparkles className="h-7 w-7 text-indigo-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 mb-1">Select a request to start matching</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                The AI engine will analyze skills, experience, availability, and utilization to find the best resource matches.
              </p>
            </div>
          )}

          {selectedRequest && (
            <div className="flex flex-col h-full">
              {/* Request detail header */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{selectedRequest.role}</h3>
                    <p className="text-xs text-slate-500">{selectedRequest.projectName} · {selectedRequest.client}</p>
                  </div>
                  <PriorityBadge priority={selectedRequest.priority} />
                </div>
                <p className="text-xs text-slate-600 mb-3">{selectedRequest.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRequest.requiredSkills.map((s) => <SkillBadge key={s} skill={s} />)}
                </div>
              </div>

              {/* Suggestions */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-700">
                  {loadingSuggestions ? "Analyzing candidates..." : `Available Candidates`}
                </h2>
                {loadingSuggestions && <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />}
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {loadingSuggestions
                  ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse" />
                  ))
                  : (() => {
                      const availableCandidates = suggestions.filter(s => {
                        const st = (s.employee.status || "").toUpperCase();
                        return st === "BENCH" || st === "AVAILABLE";
                      });
                      const unavailableCandidates = suggestions.filter(s => {
                        const st = (s.employee.status || "").toUpperCase();
                        return st === "ALLOCATED";
                      });
                      
                      const renderCard = (s: SuggestedEmployee, i: number, isUnavailable: boolean) => (
                        <motion.div
                          key={s.employee.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          data-testid={`suggestion-${s.employee.id}`}
                          className={cn(
                            "bg-white rounded-xl border p-4 transition-all",
                            isUnavailable ? "border-slate-200 opacity-70 grayscale-[20%]" : "border-slate-200 hover:border-indigo-200 hover:shadow-sm"
                          )}
                        >
                          <div className="flex items-start gap-4">
                            {/* Avatar + gauge */}
                            <div className="flex flex-col items-center gap-1">
                              <img src={s.employee.avatar} alt={s.employee.name} className="h-10 w-10 rounded-full bg-slate-100" />
                              <UtilizationGauge value={(s.employee as any).utilizationPercent ?? (s.employee as any).utilization ?? 0} size="sm" showLabel={false} />
                            </div>
    
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1.5">
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">{s.employee.name || (s.employee as any).employeeName}</p>
                                  <p className="text-xs text-slate-500">{s.employee.designation} · {s.employee.department}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {!isUnavailable && i === 0 && s.matchPercent >= 80 && (
                                    <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-semibold">
                                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Best Match
                                    </span>
                                  )}
                                  <span className={cn(
                                    "text-sm font-bold px-2.5 py-0.5 rounded-full border",
                                    isUnavailable ? "text-slate-500 bg-slate-50 border-slate-200" : "text-indigo-700 bg-indigo-50 border-indigo-100"
                                  )}>
                                    {s.matchPercent}%
                                  </span>
                                </div>
                              </div>
    
                              {/* Match reasons */}
                              <div className="space-y-1 mb-2">
                                {s.matchReasons.slice(0, 2).map((r, ri) => (
                                  <div key={ri} className="flex items-start gap-1.5 text-xs text-slate-600">
                                    <TrendingUp className={cn("h-3 w-3 flex-shrink-0 mt-0.5", isUnavailable ? "text-slate-400" : "text-emerald-500")} />
                                    {r}
                                  </div>
                                ))}
                              </div>
    
                              {/* Skill match / gap */}
                              <div className="flex flex-wrap gap-1 mb-2">
                                {s.skillMatch.slice(0, 4).map((sk) => (
                                  <SkillBadge key={sk} skill={sk} variant="default" />
                                ))}
                                {s.skillGap.slice(0, 2).map((sk) => (
                                  <SkillBadge key={sk} skill={sk} variant="gap" />
                                ))}
                              </div>
    
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <StatusBadge status={s.employee.status} />
                                </div>
                                <div className="flex items-center gap-2">
                                  {isUnavailable ? (
                                    <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg font-medium">
                                      Unavailable
                                    </span>
                                  ) : confirmed.has(s.employee.id) || (s.employee.status || "").toUpperCase() === "ALLOCATED" ? (
                                    <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium">
                                      <CheckCircle className="h-3.5 w-3.5" /> Allocated
                                    </span>
                                  ) : (
                                    <motion.button
                                      whileTap={{ scale: 0.97 }}
                                      onClick={() => handleConfirm(s.employee.id)}
                                      disabled={confirming === s.employee.id}
                                      data-testid={`btn-confirm-${s.employee.id}`}
                                      className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-60"
                                    >
                                      {confirming === s.employee.id
                                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        : <CheckCircle className="h-3.5 w-3.5" />}
                                      Allocate
                                    </motion.button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                      
                      return (
                        <>
                          {availableCandidates.length > 0 ? (
                            availableCandidates.map((s, i) => renderCard(s, i, false))
                          ) : (
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center my-2">
                              <p className="text-sm font-medium text-orange-800 mb-1">No available employees match these skills</p>
                              <p className="text-xs text-orange-600">Consider adjusting required skills or checking back later.</p>
                            </div>
                          )}
                          
                          {unavailableCandidates.length > 0 && (
                            <>
                              <div className="mt-8 mb-3">
                                <h2 className="text-sm font-semibold text-slate-700">Currently Unavailable</h2>
                                <p className="text-xs text-slate-500">These employees match but are currently allocated to other projects.</p>
                              </div>
                              {unavailableCandidates.map((s, i) => renderCard(s, i, true))}
                            </>
                          )}
                        </>
                      );
                  })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
