import React, { useState, useMemo } from 'react';
import { analyzeSystemInput } from '../services/gemini';
import { cn } from '../lib/utils';
import { Phase1Data, Phase2Data, Phase3Data, Phase4Data, Phase5Data, Phase6Data, Phase7Data, Phase8Data, Phase9Data, Phase10Data } from '../types';
import { Loader2, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, ChevronRight, Circle, XCircle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PhaseProps {
  phaseIndex: number;
  data: any;
  onSave: (data: any) => void;
  onNavigate?: (idx: number) => void;
  isLocked: boolean;
  canAdvance: boolean;
  isDevMode?: boolean;
  navMode: 'REVIEW' | 'BUILD';
}

export default function PhaseContent({ phaseIndex, data, onSave, onNavigate, isLocked, canAdvance, isDevMode, navMode }: PhaseProps) {
  if (phaseIndex === 0) return <SystemStart onSave={onSave} />;
  if (phaseIndex === 1) return <CoreBelief onSave={onSave} />;
  if (phaseIndex === 2) return <IntentSelection data={data} onSave={onSave} />;
  
  // Real Phases 1-10 (Indices 3-12)
  const actualPhaseIndex = phaseIndex - 3;
  
  const wrapPhase = (component: React.ReactNode) => (
    <div className="space-y-12">
      {actualPhaseIndex >= 0 && actualPhaseIndex <= 9 && <SystemProgressBlock />}
      {component}
      {actualPhaseIndex < data.currentPhase && actualPhaseIndex >= 0 && <PhaseCompleteBlock />}
    </div>
  );

  if (actualPhaseIndex === 0) {
    return wrapPhase(<Phase1Identity data={data} onSave={onSave} isLocked={isLocked && !isDevMode} isDevMode={isDevMode} navMode={navMode} />);
  }
  if (actualPhaseIndex === 1) {
    return wrapPhase(<Phase2World data={data} onSave={onSave} isLocked={isLocked && !isDevMode} isDevMode={isDevMode} navMode={navMode} />);
  }
  if (actualPhaseIndex === 2) {
    return wrapPhase(<Phase3Visual data={data} onSave={onSave} isLocked={isLocked && !isDevMode} isDevMode={isDevMode} navMode={navMode} />);
  }
  if (actualPhaseIndex === 3) {
    return wrapPhase(<Phase4VisualBehavior data={data} onSave={onSave} isLocked={isLocked && !isDevMode} isDevMode={isDevMode} navMode={navMode} />);
  }
  if (actualPhaseIndex === 4) {
    return wrapPhase(<Phase5PatternSystem data={data} onSave={onSave} isLocked={isLocked && !isDevMode} isDevMode={isDevMode} navMode={navMode} />);
  }
  if (actualPhaseIndex === 5) {
    return wrapPhase(<Phase6NarrativeEngine data={data} onSave={onSave} isLocked={isLocked && !isDevMode} isDevMode={isDevMode} navMode={navMode} />);
  }
  if (actualPhaseIndex === 6) {
    return wrapPhase(<Phase7SystemStructure data={data} onSave={onSave} isLocked={isLocked && !isDevMode} isDevMode={isDevMode} navMode={navMode} />);
  }
  if (actualPhaseIndex === 7) {
    return wrapPhase(<Phase8CreationLoop data={data} onSave={onSave} isLocked={isLocked && !isDevMode} isDevMode={isDevMode} navMode={navMode} />);
  }
  if (actualPhaseIndex === 8) {
    return wrapPhase(<Phase9ConversionSystem data={data} onSave={onSave} isLocked={isLocked && !isDevMode} isDevMode={isDevMode} navMode={navMode} />);
  }
  if (actualPhaseIndex === 9) {
    return wrapPhase(<Phase10ControlSystem data={data} onSave={onSave} onNavigate={onNavigate} isLocked={isLocked && !isDevMode} isDevMode={isDevMode} navMode={navMode} />);
  }
  if (actualPhaseIndex === 10) {
    return <SystemAudit data={data} onSave={onSave} onNavigate={onNavigate} />;
  }

  return <PhaseInputs phaseIndex={actualPhaseIndex} data={data} onSave={onSave} isLocked={isLocked} />;
}

// --- SUB-COMPONENTS ---

function SystemStart({ onSave }: { onSave: (data: any) => void }) {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 max-w-3xl">
      <div className="space-y-6">
        <span className="text-[10px] uppercase font-black tracking-[4px] text-ww-cyan">🪞 SYSTEM ENTRY</span>
        <h2 className="text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter italic uppercase">
          WORLD WITHIN<br/>METHOD™
        </h2>
        <p className="text-xl font-medium leading-relaxed opacity-80 normal-case border-l-2 border-ww-cyan pl-6">
          A system for building a world through identity, structure, repetition, and visual language so content stops feeling random and starts feeling like it belongs.
        </p>
      </div>

      <div className="p-8 md:p-12 border border-white/10 bg-white/2 space-y-6 text-center">
        <p className="text-2xl md:text-4xl font-black italic tracking-tight uppercase leading-none">
          "You are not starting with content.<br/>
          You are building what content comes from."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black tracking-[4px] text-ww-cyan uppercase border-b border-white/10 pb-2">WHAT THIS IS</h3>
            <div className="space-y-2 text-sm font-bold uppercase tracking-tight opacity-70 italic">
              <p>This is not a content system.</p>
              <p>This is a world-building system.</p>
              <p>You are not here to post more.</p>
              <p>You are here to build something that holds.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black tracking-[4px] text-ww-cyan uppercase border-b border-white/10 pb-2">HOW THIS WORKS</h3>
            <div className="space-y-2 text-sm font-bold uppercase tracking-tight opacity-70 italic">
              <p>You will move through phases.</p>
              <p>Each phase builds on the last.</p>
              <p>If you skip, the system breaks.</p>
              <p>If you rush, nothing connects.</p>
              <p>Build it in order.</p>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-6 text-[10px] uppercase font-black tracking-widest">
            <h3 className="text-xs font-black tracking-[4px] text-ww-cyan uppercase border-b border-white/10 pb-2">TOOLS</h3>
            <div className="space-y-6">
               <div className="space-y-3">
                 <span className="text-ww-pink-rose">🪞 Method Document</span>
                 <p className="opacity-40 italic">Read the full system before or alongside building</p>
                 <a 
                   href="https://meteor-epoxy-afc.notion.site/World-Within-Method-334e96ae423480ddaca2e265f61d014d?source=copy_link"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-block px-4 py-2 border border-ww-pink-rose/30 text-ww-pink-rose hover:bg-ww-pink-rose/10 transition-colors no-underline text-[9px] font-black tracking-widest uppercase"
                 >
                   [ VIEW METHOD DOCUMENT ]
                 </a>
               </div>
               <div className="space-y-1">
                 <span className="text-ww-cyan">⭕️ The App (this)</span>
                 <p className="opacity-40 italic">Build your system step-by-step</p>
               </div>
               <div className="space-y-1 text-white">
                 <span className="flex items-center gap-2">❤️‍🔥 The Bot</span>
                 <p className="opacity-40 italic">Refine what you already defined</p>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black tracking-[4px] text-ww-pink-deep uppercase border-b border-ww-pink-deep/30 pb-2 italic">RULE</h3>
            <div className="space-y-2 text-sm font-black uppercase tracking-tight text-white/90 italic">
              <p>Do not try to build everything at once.</p>
              <p className="text-ww-cyan">Define one thing. Then move forward.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 border-t border-white/10 space-y-12">
        <div className="space-y-4 text-center">
           <h3 className="text-xs font-black tracking-[4px] text-white/30 uppercase italic">ENTRY CONFIRMATION</h3>
           <p className="text-xl font-bold uppercase tracking-tighter italic">"By continuing, you are not browsing. <br/>You are building a system."</p>
        </div>

        <div className="text-center space-y-6">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSave({ introStart: true });
            }} 
            className="initialize-btn w-full md:w-[450px] mx-auto animate-pulse hover:animate-none"
          >
            [ CONFIRM SYSTEM UNDERSTANDING ]
          </button>
          <div className="space-y-2">
            <span className="enforcement-text block">System unlocks after confirmation.</span>
            <span className="text-[10px] font-black tracking-[8px] text-white/20 uppercase block">↓ SYSTEM START ↓</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoreBelief({ onSave }: { onSave: (data: any) => void }) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
      <div className="space-y-4">
        <span className="top-label">Core Philosophy</span>
        <h2 className="text-4xl md:text-6xl font-black leading-[0.85] tracking-tighter">
          THE RULE OF<br/>ORIGIN.
        </h2>
      </div>

      <div className="space-y-10 max-w-2xl">
        <div className="space-y-6">
          <p className="text-2xl md:text-3xl font-black leading-[0.95] text-ww-pink-rose italic">
            "This system is not designed to recreate my world. It is designed to force you to create your own."
          </p>
          <p className="text-lg md:text-xl font-medium opacity-70">
            "If your content can be confused with someone else’s, you do not have a world yet."
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 pt-6">
          <MethodItem 
            title="What this controls" 
            content="Originality and differentiation." 
          />
          <MethodItem 
            title="How to apply it" 
            content="Reject any decision that feels 'common' or 'templated'." 
          />
          <MethodItem 
            title="Action Step" 
            content="Commit to the burden of singular identity." 
          />
        </div>

        <div className="pt-10">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSave({ introBelief: true });
            }} 
            className="initialize-btn"
          >
            THIS MUST BE MINE
          </button>
          <span className="enforcement-text">ENFORCEMENT_PROTOCOL_ACTIVE // ORIGIN_VERIFIED</span>
        </div>
      </div>
    </div>
  );
}

function IntentSelection({ data, onSave }: { data: any, onSave: (data: any) => void }) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [interacted, setInteracted] = useState(false);

  const expressionSections = [
    { id: 'art', title: 'Artistic Identity', content: 'The specific lens through which you view reality. Not what you see, but the distortion you apply to it.' },
    { id: 'story', title: 'Visual Storytelling', content: 'The sequence of frames that communicate a world without words.' },
    { id: 'immersion', title: 'Immersion', content: 'The removal of external reality and the replacement with system rules.' },
    { id: 'atm', title: 'Brand Atmosphere', content: 'The non-verbal feeling that remains after the interaction has closed.' },
    { id: 'universe', title: 'Personal Universe Building', content: 'The construction of a self-sustaining conceptual space.' }
  ];

  const offerSections = [
    { id: 'msg', title: 'Messaging', content: 'The linguistic bridge between your system and the audience need.' },
    { id: 'conv', title: 'Conversion', content: 'The point where world exploration becomes intent transformation.' },
    { id: 'struct', title: 'Content Structure', content: 'The delivery mechanism that ensures the offer feels like a natural part of the world.' },
    { id: 'move', title: 'Audience Movement', content: 'Control over the path the audience takes through your ecosystem.' },
    { id: 'reason', title: 'A Reason For The World', content: 'Defining why this world leads to a specific outcome.' }
  ];

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (interacted) {
      onSave({ intentReviewed: true });
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
      <div className="space-y-4">
        <span className="top-label">System Architecture</span>
        <h2 className="text-4xl md:text-6xl font-black leading-[0.85] tracking-tighter">
          KNOWLEDGE_SYNC:<br/>INTENT_LAYERS.
        </h2>
      </div>

      {/* SECTION 1 — UNDERSTANDING */}
      <div className="space-y-10 max-w-2xl border-l border-white/10 pl-8 ml-2">
        <div className="space-y-6">
          <p className="text-xl font-medium leading-relaxed opacity-80">
            INTENT is the primary directive of your world. It is not a choice between two paths, but a simultaneous understanding of how your system functions across two layers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 pt-6">
          <MethodItem 
            title="Explanation" 
            content="Intent is the invisible glue that holds your world together. It is the 'Why' behind every pixel and every sentence." 
          />
          <MethodItem 
            title="What this controls" 
            content="The trajectory of user engagement, system depth, and conceptual integrity." 
          />
          <MethodItem 
            title="How to apply it" 
            content="Observe your system through both the Expression and Direction layers simultaneously." 
          />
          <MethodItem 
            title="Failure point" 
            content="When you prioritize aesthetics over the intent, or intent over the world's internal logic." 
          />
          <MethodItem 
            title="What to do" 
            content="Commit to the definitions below as your system's constitution." 
          />
          <MethodItem 
            title="Bot application" 
            content="This knowledge dictates what the enforcement protocols will prioritize during logic scans." 
          />
          <MethodItem 
            title="Action step" 
            content="Review at least one section from each layer below to synchronize." 
          />
        </div>
      </div>

      <div className="h-[1px] w-full bg-white/5" />

      {/* SECTION 1 — Expression Layer */}
      <div className="space-y-8 max-w-3xl">
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[3px] text-ww-cyan font-bold opacity-50 underline underline-offset-8 decoration-ww-cyan/20">Layer 1: Expression System</p>
          <div className="space-y-3">
            {expressionSections.map(s => (
              <div key={s.id}>
                <AccordionItem 
                  title={s.title}
                  content={s.content}
                  isOpen={openSection === s.id}
                  onToggle={(e) => { 
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenSection(openSection === s.id ? null : s.id); 
                    setInteracted(true); 
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2 — System Direction Layer */}
      <div className="space-y-8 max-w-3xl">
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[3px] text-ww-pink-rose font-bold opacity-50 underline underline-offset-8 decoration-ww-pink-rose/20">Layer 2: System Direction</p>
          <div className="space-y-3">
            {offerSections.map(s => (
              <div key={s.id}>
                <AccordionItem 
                  title={s.title}
                  content={s.content}
                  isOpen={openSection === s.id}
                  onToggle={(e) => { 
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenSection(openSection === s.id ? null : s.id); 
                    setInteracted(true); 
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONFIRMATION */}
      <div className="pt-12 border-t border-white/5 max-w-3xl">
        <p className="text-xs text-white/40 italic mb-6">Interaction check required. Review layer definitions to proceed.</p>
        <button 
          type="button"
          disabled={!interacted}
          onClick={handleConfirm} 
          className={cn("initialize-btn w-full md:w-auto", !interacted && "opacity-20 cursor-not-allowed")}
        >
          CONFIRM SYSTEM UNDERSTANDING
        </button>
        <span className="enforcement-text">ENFORCEMENT_PROTOCOL_ACTIVE // KNOWLEDGE_SYNC_COMPLETE</span>
      </div>
    </div>
  );
}

function AccordionItem({ title, content, isOpen, onToggle }: { title: string, content: string, isOpen: boolean, onToggle: (e: React.MouseEvent) => void }) {
  return (
    <div className="border border-white/5 bg-white/2 overflow-hidden hover:bg-white/5 transition-colors">
      <button 
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-bold tracking-tight text-white/80">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-ww-pink-rose" /> : <ChevronDown className="w-4 h-4 text-ww-cyan" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-8 text-sm leading-relaxed text-white/60 space-y-4"
          >
            <div className="h-[1px] w-8 bg-ww-cyan opacity-20 mb-4" />
            <p>{content}</p>
            <div className="pt-2">
              <p className="text-[10px] text-ww-pink-rose font-black uppercase tracking-widest italic">Action Step: Internalize the rules for {title.toLowerCase()}.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PhaseInputs({ phaseIndex, data, onSave, isLocked }: { phaseIndex: number, data: any, onSave: (data: any) => void, isLocked: boolean }) {
  const [form, setForm] = useState<any>(data[`phase${phaseIndex + 1}`] || {});
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnalyzing(true);
    setError(null);

    const values = Object.values(form);
    if (values.length < getPhaseFields(phaseIndex).length || values.some(v => !(v as string).trim())) {
      setError("SYSTEM_REJECTION: All parameters must be defined.");
      setAnalyzing(false);
      return;
    }

    // AI Check for vibe/aesthetic/vague language
    const fullInput = values.join(" ");
    const analysis = await analyzeSystemInput(fullInput);
    if (!analysis.passed) {
      setError(`ENFORCEMENT_FAILURE: ${analysis.reasons[0]}`);
      setAnalyzing(false);
      return;
    }

    await onSave({ [`phase${phaseIndex + 1}`]: form });
    setAnalyzing(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
      <div className="space-y-4">
        <span className="top-label">Phase {phaseIndex + 1} Protocol</span>
        <h2 className="text-4xl md:text-6xl font-black leading-[0.85] tracking-tighter uppercase whitespace-normal break-words">
          {getPhaseTitle(phaseIndex)}
        </h2>
        <div className="h-[2px] w-24 bg-ww-pink-rose mt-4" />
      </div>

      <div className="space-y-10 max-w-2xl">
        {getPhaseFields(phaseIndex).map((field) => (
          <div key={field.id} className="space-y-4">
            <label className="text-[10px] uppercase tracking-[3px] text-ww-cyan font-black opacity-60">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={form[field.id] || ''}
                disabled={isLocked}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full bg-white/5 border border-white/10 p-6 text-white/90 font-medium leading-relaxed placeholder:opacity-20 focus:outline-none focus:border-ww-pink-rose transition-colors resize-none"
              />
            ) : (
              <input
                type="text"
                value={form[field.id] || ''}
                disabled={isLocked}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-white/5 border border-white/10 p-6 text-white/90 font-medium leading-relaxed placeholder:opacity-20 focus:outline-none focus:border-ww-pink-rose transition-colors"
              />
            )}
            {field.description && <p className="text-[10px] text-ww-gray-medium/60 italic font-medium">{field.description}</p>}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-ww-pink-deep/10 border border-ww-pink-deep/30 p-6 text-ww-pink-deep text-xs flex items-start gap-4 animate-in shake-1">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="font-black tracking-widest leading-relaxed uppercase">{error}</p>
        </div>
      )}

      <div className="pt-10">
        <button
          type="button"
          onClick={validate}
          disabled={analyzing || isLocked}
          className={cn(
            "initialize-btn w-full flex items-center justify-center gap-3",
            (analyzing || isLocked) && "opacity-30 cursor-not-allowed shadow-none translate-y-1"
          )}
        >
          {analyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              INTEGRITY_SCAN_IN_PROGRESS...
            </>
          ) : isLocked ? (
            "ENFORCEMENT_LOCK_ACTIVE"
          ) : (
            "PROCESS_SYSTEM_DATA"
          )}
        </button>
        <span className="enforcement-text">ENFORCEMENT_PROTOCOL_ACTIVE // INPUT_VALIDATION_ACTIVE</span>
      </div>
    </div>
  );
}

function SystemAudit({ data, onSave, onNavigate }: { data: any, onSave: (data: any) => void, onNavigate?: (idx: number) => void }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);

  const runAudit = async () => {
    setAnalyzing(true);
    const fullText = JSON.stringify(data);
    const result = await analyzeSystemInput(fullText);
    setReport({
      integrity: 100 - (result.vagueWordsFound.length * 5),
      anomalies: result.vagueWordsFound.length,
      vagueTerms: result.vagueWordsFound,
      passed: result.passed
    });
    setAnalyzing(false);
  };

  if (data.completed) {
    return <FinalSummary data={data} onSave={onSave} />;
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-24">
      <div className="space-y-4">
        <span className="top-label tracking-[3px]">Enforcement Control</span>
        <h2 className="text-6xl font-black leading-[0.85] tracking-tighter">FINAL_AUDIT</h2>
        <div className="h-[2px] w-24 bg-ww-cyan mt-4" />
      </div>

      <div className="p-6 md:p-10 bg-white/5 border border-white/10 font-mono text-xs space-y-8 shadow-2xl">
        <p className="text-ww-cyan font-black">[PROTO_v4.2.0] INITIALIZING INTEGRITY_SYNC...</p>
        <div className="space-y-3 text-white/50">
          <p className="flex justify-between"><span>IDENTITY_INTEGRITY:</span> <span className="text-ww-cyan">[ OK ]</span></p>
          <p className="flex justify-between"><span>WORLD_COHESION:</span> <span className="text-ww-cyan">[ OK ]</span></p>
          <p className="flex justify-between"><span>VISUAL_PARAMETER_SYNC:</span> <span className="text-ww-cyan">[ OK ]</span></p>
          <p className="flex justify-between"><span>MODAL_INTENT_ALIGN:</span> <span className="text-ww-cyan">[ OK ]</span></p>
        </div>
        {!report && (
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              runAudit();
            }} 
            disabled={analyzing}
            className="text-ww-pink-rose font-black text-[10px] tracking-widest uppercase border border-ww-pink-rose/30 px-6 py-3 hover:bg-ww-pink-rose/10 transition-colors flex items-center gap-3"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin"/> : "[ RUN_SYSTEM_INTEGRITY_CHECK ]"}
          </button>
        )}
        {report && (
          <div className="space-y-4 pt-8 border-t border-white/10">
            <p className={cn("text-[10px] tracking-widest font-black uppercase", report.passed ? "text-ww-cyan" : "text-ww-pink-rose")}>
              CORE_INTEGRITY: {report.integrity}%
            </p>
            <p className="text-[10px] tracking-widest">ANOMALIES_DETECTED: {report.anomalies}</p>
            {report.vagueTerms.length > 0 && (
              <p className="text-ww-pink-deep font-black bg-ww-pink-deep/10 p-4 border border-ww-pink-deep/20 text-[9px] tracking-widest leading-relaxed">
                DETECTED_DRIFT: {report.vagueTerms.join(", ").toUpperCase()}
              </p>
            )}
            <div className="pt-6">
              <p className={cn("text-xs font-black tracking-[4px] px-6 py-4 inline-block uppercase", report.passed ? "bg-ww-cyan/20 text-ww-cyan border border-ww-cyan/40" : "bg-ww-pink-deep/20 text-ww-pink-deep border border-ww-pink-deep/40")}>
                STATUS: {report.passed ? "SYSTEM_PASS_VERIFIED" : "ADJUSTMENTS_REQUIRED"}
              </p>
            </div>
          </div>
        )}
      </div>

      {report?.passed && (
        <div className="pt-10 space-y-6">
          <button
            type="button"
            onClick={() => {
              onNavigate?.(3);
              setTimeout(() => {
                document.getElementById('phase-1')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-full py-4 text-[10px] font-black tracking-widest uppercase border border-ww-cyan/30 text-ww-cyan hover:bg-ww-cyan/10 transition-all"
          >
            [ REFINE YOUR SYSTEM ]
          </button>
          <div className="space-y-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSave({ completed: true });
              }}
              className="initialize-btn w-full"
            >
              INITIALIZE_SYSTEM_LOOP
            </button>
            <span className="enforcement-text block text-center">ENFORCEMENT_PROTOCOL_ACTIVE // SYSTEM_INIT_READY</span>
          </div>
        </div>
      )}
    </div>
  );
}

function FinalSummary({ data, onSave }: { data: any, onSave?: (data: any) => void }) {
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({
    identity: false,
    world: false,
    visual: false,
    narrative: false,
    structure: false,
    manifesto: false
  });

  const [isLocked, setIsLocked] = useState(data.systemLocked || false);

  const toggleConfirm = (key: string) => {
    if (isLocked) return;
    setConfirmed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinalLock = () => {
    if (onSave) {
      onSave({ ...data, systemLocked: true });
      setIsLocked(true);
    }
  };

  const allConfirmed = Object.values(confirmed).every(v => v === true);

  return (
    <div className="space-y-24 animate-in zoom-in-95 duration-1000 pb-32">
      <div className="text-center space-y-4 pt-12">
        <h2 className="text-xs font-black tracking-[8px] text-ww-cyan/40 uppercase">Construction Record</h2>
        <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6 italic">FINAL RESULT</h2>
        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">This is not a summary. This is the system you built.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-32">
        {/* IDENTITY */}
        <section id="phase-1" className="space-y-12 scroll-mt-24">
          <div className="space-y-4 border-b border-white/10 pb-6 uppercase">
            <span className="text-[10px] font-black tracking-[4px] text-ww-cyan">🪞 YOU BUILT</span>
            <h3 className="text-4xl font-black italic tracking-tighter text-white">🔥 Identity</h3>
          </div>
          <div className="space-y-8">
            <p className="text-xl font-bold leading-relaxed text-white/80 normal-case">Identity is the foundation of everything you create. It defines how your character behaves, what they represent, and what they refuse. This is what makes your work feel like it belongs to someone specific instead of blending in with everyone else.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] uppercase tracking-widest font-black">
               <MethodItem title="What this controls" content="It controls recognition, behavior, and direction." />
               <MethodItem title="How to apply it" content="Define the identity clearly before building the world." />
               <MethodItem title="Failure point" content="Without identity, everything else becomes unstable." />
               <MethodItem title="What to do" content="Define identity before anything else." />
            </div>
            <div className="p-8 bg-white/2 border border-white/10 space-y-6">
              <MethodItem title="Definition — What to do" content="What to do is establishing the core foundation that everything is built from." />
              <MethodItem title="Bot application" content="Use the bot to detect unclear or undefined identity." />
              <MethodItem title="Definition — Bot application" content="Bot application is identifying lack of identity and forcing clarity." />
              <MethodItem title="Action step" content="Write one clear identity definition." />
              <MethodItem title="Definition — Action step" content="An action step is one enforced definition that anchors the system." />
            </div>
          </div>
          <button 
            disabled={isLocked}
            onClick={() => toggleConfirm('identity')}
            className={cn(
              "w-full py-6 font-black tracking-[4px] text-[10px] uppercase border transition-all",
              confirmed.identity ? "bg-ww-cyan text-ww-charcoal border-ww-cyan" : "bg-transparent border-white/10 text-white/40 hover:border-white/30"
            )}
          >
            {confirmed.identity ? "[ IDENTITY_PASSED ]" : "[ CONFIRM IDENTITY ]"}
          </button>
        </section>

        {/* WORLD */}
        <section className="space-y-12">
          <div className="space-y-4 border-b border-white/10 pb-6 uppercase">
            <h3 className="text-4xl font-black italic tracking-tighter text-white">❤️‍🔥 World</h3>
          </div>
          <div className="space-y-8">
            <p className="text-xl font-bold leading-relaxed text-white/80 normal-case">The world is the environment your identity exists inside. It gives your character context, rules, and a consistent space to operate in. This is what turns separate visuals into something that feels connected.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] uppercase tracking-widest font-black">
               <MethodItem title="What this controls" content="It controls context, consistency, and visual logic." />
               <MethodItem title="How to apply it" content="Build the world as the environment that holds the identity." />
               <MethodItem title="Failure point" content="Without a world, visuals remain disconnected." />
               <MethodItem title="What to do" content="Build a defined environment for your identity." />
            </div>
            <div className="p-8 bg-white/2 border border-white/10 space-y-6">
              <MethodItem title="Definition — What to do" content="What to do is creating the space that holds all content together." />
              <MethodItem title="Bot application" content="Use the bot to detect disconnected visuals." />
              <MethodItem title="Definition — Bot application" content="Bot application is identifying lack of environment and forcing structure." />
              <MethodItem title="Action step" content="Define one consistent world environment." />
              <MethodItem title="Definition — Action step" content="An action step is one enforced definition that creates connection." />
            </div>
          </div>
          <button 
            disabled={isLocked}
            onClick={() => toggleConfirm('world')}
            className={cn(
              "w-full py-6 font-black tracking-[4px] text-[10px] uppercase border transition-all",
              confirmed.world ? "bg-ww-cyan text-ww-charcoal border-ww-cyan" : "bg-transparent border-white/10 text-white/40 hover:border-white/30"
            )}
          >
            {confirmed.world ? "[ WORLD_ENVIRONMENT_PASSED ]" : "[ CONFIRM WORLD ]"}
          </button>
        </section>

        {/* VISUAL SYSTEM */}
        <section className="space-y-12">
          <div className="space-y-4 border-b border-white/10 pb-6 uppercase">
            <h3 className="text-4xl font-black italic tracking-tighter text-white">⭕️ Visual System</h3>
          </div>
          <div className="space-y-8">
            <p className="text-xl font-bold leading-relaxed text-white/80 normal-case">The visual system is how your world is seen. It includes lighting, color, composition, styling, and repeated visual patterns. This is what makes your content recognizable even before someone reads anything.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] uppercase tracking-widest font-black">
               <MethodItem title="What this controls" content="It controls recognizability and visual consistency." />
               <MethodItem title="How to apply it" content="Repeat the same visual logic over time." />
               <MethodItem title="Failure point" content="Without a visual system, recognition never compounds." />
               <MethodItem title="What to do" content="Define and repeat visual patterns." />
            </div>
            <div className="p-8 bg-white/2 border border-white/10 space-y-6">
              <MethodItem title="Definition — What to do" content="What to do is establishing consistent visual behavior." />
              <MethodItem title="Bot application" content="Use the bot to detect inconsistent visuals." />
              <MethodItem title="Definition — Bot application" content="Bot application is identifying lack of visual consistency and forcing alignment." />
              <MethodItem title="Action step" content="Choose one visual pattern to repeat." />
              <MethodItem title="Definition — Action step" content="An action step is one enforced repetition that builds recognition." />
            </div>
          </div>
          <button 
            disabled={isLocked}
            onClick={() => toggleConfirm('visual')}
            className={cn(
              "w-full py-6 font-black tracking-[4px] text-[10px] uppercase border transition-all",
              confirmed.visual ? "bg-ww-cyan text-ww-charcoal border-ww-cyan" : "bg-transparent border-white/10 text-white/40 hover:border-white/30"
            )}
          >
            {confirmed.visual ? "[ VISUAL_STREAMS_PASSED ]" : "[ CONFIRM VISUAL SYSTEM ]"}
          </button>
        </section>

        {/* NARRATIVE */}
        <section className="space-y-12">
          <div className="space-y-4 border-b border-white/10 pb-6 uppercase">
            <h3 className="text-4xl font-black italic tracking-tighter text-white">❤️‍🔥 Narrative</h3>
          </div>
          <div className="space-y-8">
            <p className="text-xl font-bold leading-relaxed text-white/80 normal-case">The narrative is how your world moves over time. It is what evolves, what gets revealed, and what keeps people watching. This is what makes your content feel like something ongoing instead of one-off posts.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] uppercase tracking-widest font-black">
               <MethodItem title="What this controls" content="It controls progression and retention." />
               <MethodItem title="How to apply it" content="Let something keep evolving instead of resetting every post." />
               <MethodItem title="Failure point" content="Without narrative, the world feels static." />
               <MethodItem title="What to do" content="Create ongoing progression in your content." />
            </div>
            <div className="p-8 bg-white/2 border border-white/10 space-y-6">
              <MethodItem title="Definition — What to do" content="What to do is ensuring something continues and evolves." />
              <MethodItem title="Bot application" content="Use the bot to detect static or repetitive content." />
              <MethodItem title="Definition — Bot application" content="Bot application is identifying lack of progression and forcing evolution." />
              <MethodItem title="Action step" content="Define one thing that continues across posts." />
              <MethodItem title="Definition — Action step" content="An action step is one enforced continuation that builds narrative." />
            </div>
          </div>
          <button 
            disabled={isLocked}
            onClick={() => toggleConfirm('narrative')}
            className={cn(
              "w-full py-6 font-black tracking-[4px] text-[10px] uppercase border transition-all",
              confirmed.narrative ? "bg-ww-cyan text-ww-charcoal border-ww-cyan" : "bg-transparent border-white/10 text-white/40 hover:border-white/30"
            )}
          >
            {confirmed.narrative ? "[ NARRATIVE_EVOLUTION_PASSED ]" : "[ CONFIRM NARRATIVE ]"}
          </button>
        </section>

        {/* STRUCTURE */}
        <section className="space-y-12">
          <div className="space-y-4 border-b border-white/10 pb-6 uppercase">
            <h3 className="text-4xl font-black italic tracking-tighter text-white">🪞 Structure</h3>
          </div>
          <div className="space-y-8">
            <p className="text-xl font-bold leading-relaxed text-white/80 normal-case">Structure is how everything is organized so it repeats instead of staying random. It controls how your content flows, how it is presented, and how people begin to recognize patterns in what you create.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] uppercase tracking-widest font-black">
               <MethodItem title="What this controls" content="It controls repetition and coherence." />
               <MethodItem title="How to apply it" content="Use repeatable systems and post logic." />
               <MethodItem title="Failure point" content="Without structure, content stays scattered." />
               <MethodItem title="What to do" content="Organize content into repeatable patterns." />
            </div>
            <div className="p-8 bg-white/2 border border-white/10 space-y-6">
              <MethodItem title="Definition — What to do" content="What to do is creating consistent flow and format." />
              <MethodItem title="Bot application" content="Use the bot to detect scattered content." />
              <MethodItem title="Definition — Bot application" content="Bot application is identifying lack of structure and forcing pattern." />
              <MethodItem title="Action step" content="Define one repeatable content structure." />
              <MethodItem title="Definition — Action step" content="An action step is one enforced system that builds coherence." />
            </div>
          </div>
          <button 
            disabled={isLocked}
            onClick={() => toggleConfirm('structure')}
            className={cn(
              "w-full py-6 font-black tracking-[4px] text-[10px] uppercase border transition-all",
              confirmed.structure ? "bg-ww-cyan text-ww-charcoal border-ww-cyan" : "bg-transparent border-white/10 text-white/40 hover:border-white/30"
            )}
          >
            {confirmed.structure ? "[ REPETITION_SYSTEM_PASSED ]" : "[ CONFIRM STRUCTURE ]"}
          </button>
        </section>

        {/* MANIFESTO */}
        <section className="space-y-16 py-24 border-y border-white/10">
          <div className="space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter text-ww-cyan">CONTENT BECOMES THE RESULT</h3>
            <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">This means content is no longer the starting point.</p>
          </div>

          <div className="space-y-12 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed italic opacity-80">
            <p>You are not waking up trying to figure out what to post.</p>
            <div className="space-y-4 border-l-2 border-ww-pink-rose pl-8 py-4">
              <p>• your identity determines what fits</p>
              <p>• your world determines what belongs</p>
              <p>• your visual system determines how it looks</p>
              <p>• your narrative determines what is revealed</p>
              <p>• your structure determines how it repeats</p>
            </div>
            <div className="space-y-6">
              <p>Because of this, your content stops feeling:</p>
              <div className="flex gap-4 text-ww-pink-deep uppercase text-xs font-black tracking-widest">
                <span>[ RANDOM ]</span>
                <span>[ INCONSISTENT ]</span>
                <span>[ FORCED ]</span>
              </div>
            </div>
            <div className="space-y-6">
              <p>And starts feeling:</p>
              <div className="flex gap-4 text-ww-cyan uppercase text-xs font-black tracking-widest">
                <span>[ CONNECTED ]</span>
                <span>[ INTENTIONAL ]</span>
                <span>[ RECOGNIZABLE ]</span>
              </div>
            </div>
            <p className="text-white font-black not-italic border-t border-white/5 pt-8">You are no longer creating isolated posts. You are creating pieces of a world.</p>
          </div>

          <div className="space-y-8 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] uppercase tracking-widest font-black">
              <MethodItem title="What this controls" content="This controls how content is created and perceived." />
              <MethodItem title="How to apply it" content="Build the system first, then create from it instead of searching for ideas first." />
              <MethodItem title="Failure point" content="If content becomes the starting point again, the world collapses back into randomness." />
              <MethodItem title="What to do" content="Create from the system, not before it." />
            </div>
            <div className="p-8 bg-white/2 border border-white/10 space-y-6">
              <MethodItem title="Definition — What to do" content="What to do is reversing the creation order so content is the result." />
              <MethodItem title="Bot application" content="Use the bot to detect content-first behavior." />
              <MethodItem title="Definition — Bot application" content="Bot application is identifying randomness and forcing system-first creation." />
              <MethodItem title="Action step" content="Before posting, check if it comes from your system." />
              <MethodItem title="Definition — Action step" content="An action step is one enforced check that protects the system." />
            </div>
          </div>

          <button 
            disabled={isLocked}
            onClick={() => toggleConfirm('manifesto')}
            className={cn(
              "w-full py-6 font-black tracking-[4px] text-[10px] uppercase border transition-all",
              confirmed.manifesto ? "bg-ww-cyan text-ww-charcoal border-ww-cyan" : "bg-transparent border-white/10 text-white/40 hover:border-white/30"
            )}
          >
            {confirmed.manifesto ? "[ SYSTEM_ORDER_PASSED ]" : "[ ACKNOWLEDGE_ORDER ]"}
          </button>
        </section>

        {/* FINAL CONFIRMATION */}
        <section className="text-center space-y-12">
          <div className="space-y-4">
            <h3 className="text-xs font-black tracking-[8px] text-white/20 uppercase">Final Confirmation</h3>
            <p className="text-2xl font-black italic tracking-tighter uppercase text-white/60">
              You are not finished. <br/> 
              <span className="text-ww-cyan">You are defined.</span>
            </p>
          </div>

          {isLocked ? (
             <div className="space-y-16 animate-in zoom-in duration-500 text-left max-w-2xl mx-auto">
               <div className="p-12 bg-ww-cyan border border-ww-cyan/20 text-ww-charcoal text-center">
                  <span className="text-[10px] font-black tracking-[6px] uppercase">SYSTEM_STABILIZED_AND_LOCKED</span>
                  <p className="text-xl font-black mt-4 italic tracking-tight uppercase">“The system is the floor. You can only go up from here.”</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                  <div className="space-y-6">
                    <h4 className="text-xs font-black tracking-widest text-ww-cyan uppercase">LOCK SYSTEM — RESULTS</h4>
                    <ul className="text-[10px] font-black tracking-widest space-y-3 opacity-60 uppercase">
                      <li>• Saves your system</li>
                      <li>• Marks your structure as complete</li>
                      <li>• Allows you to create from it</li>
                      <li>• Allows refinement at any time</li>
                    </ul>
                    <div className="pt-4 border-t border-white/10">
                       <p className="text-[10px] font-black text-ww-pink-rose uppercase italic">IMPORTANT: THIS DOES NOT FREEZE YOUR SYSTEM.</p>
                       <p className="text-[9px] font-medium text-white/40 mt-2">You can return and refine identity, world, visuals, narrative, and structure at any time.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-xs font-black tracking-widest text-ww-pink-deep uppercase italic">REFINEMENT LOOP</h4>
                    <div className="space-y-3 text-[10px] font-black tracking-widest opacity-80 uppercase">
                      <p>→ Use the app to adjust</p>
                      <p>→ Use the bot to refine</p>
                      <p>→ Repeat the loop</p>
                    </div>
                    <p className="text-[9px] font-medium text-white/40">This is how the system strengthens over time.</p>
                  </div>
               </div>

               <div className="p-8 bg-ww-pink-deep/5 border border-ww-pink-deep/20 space-y-4">
                  <span className="text-[10px] font-black tracking-[4px] text-ww-pink-deep uppercase italic">WARNING</span>
                  <p className="text-xs font-black tracking-widest leading-relaxed text-white/60 uppercase">
                    "If you stop using the system and go back to random content, the structure breaks. Stay inside what you built."
                  </p>
               </div>
               
               <div className="text-center pt-8">
                  <button 
                    onClick={() => setIsLocked(false)}
                    className="text-[10px] font-black tracking-[4px] text-white/20 hover:text-white/60 transition-colors uppercase"
                  >
                    [ UNLOCK FOR ADJUSTMENT ]
                  </button>
               </div>
             </div>
          ) : allConfirmed ? (
            <div className="space-y-12 max-w-xl mx-auto">
              <div className="bg-white/2 border border-white/5 p-8 text-left space-y-4">
                <span className="text-[10px] font-black tracking-[3px] text-ww-cyan uppercase">What this does:</span>
                <ul className="text-[10px] font-black tracking-widest space-y-2 opacity-60 uppercase">
                  <li>• Saves your system</li>
                  <li>• Marks your structure as complete</li>
                  <li>• Allows you to create from it</li>
                  <li>• Allows refinement at any time</li>
                </ul>
              </div>
              <button 
                onClick={handleFinalLock}
                className="initialize-btn w-full flex items-center justify-center gap-4 animate-pulse hover:animate-none"
              >
                <Lock className="w-4 h-4" /> [ LOCK MY SYSTEM ]
              </button>
              <p className="text-[10px] font-black text-white/20 uppercase italic tracking-widest leading-relaxed">
                Important: Locking establishes the foundation. <br/>
                It does not prevent evolution.
              </p>
            </div>
          ) : (
            <div className="p-12 border border-white/5 bg-white/2 max-w-2xl mx-auto space-y-8 animate-in fade-in">
              <p className="enforcement-text opacity-40 uppercase tracking-[4px]">AWAITING_FULL_PROTOCOL_CONFIRMATION // 0/6_CONFIRMED</p>
              <div className="flex flex-wrap justify-center gap-2 opacity-20">
                {Object.keys(confirmed).map(key => (
                  <span key={key} className={cn("px-3 py-1 border text-[9px] font-black tracking-widest uppercase", confirmed[key] ? "border-ww-cyan text-ww-cyan" : "border-white/10")}>
                    {key}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
        
        <div className="pt-24 border-t border-white/5">
           <RefineLoopBlock />
        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---

function MethodItem({ title, content }: { title: string, content: string }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] uppercase font-black tracking-[3px] text-ww-cyan opacity-50 underline underline-offset-4 decoration-ww-cyan/20">{title}</span>
      <p className="text-lg font-bold tracking-tight text-white/90">{content}</p>
    </div>
  );
}

function getPhaseTitle(index: number) {
  const titles = [
    "Identity", "World", "Visual System", "Narrative", 
    "Pattern System", "Narrative Engine", "System Structure", 
    "Creation Loop", "Conversion System", "Control System"
  ];
  return titles[index];
}

function getPhaseFields(index: number) {
  const fields: any[][] = [
    [
      { id: 'represent', label: 'What do you represent?', type: 'textarea', description: 'Describe the core essence your system embodies.', placeholder: 'e.g., Clinical precision and brutalist architecture...' },
      { id: 'notRepresent', label: 'What do you NOT represent?', type: 'textarea', description: 'Define the boundaries your system will never cross.', placeholder: 'e.g., Soft colors, organic curves, sentimentality...' },
      { id: 'refuse', label: 'What do you refuse?', type: 'textarea', description: 'Be uncompromising. What is strictly forbidden?', placeholder: 'e.g., I refuse to compromise on structure for the sake of "vibe".' }
    ],
    [
      { id: 'environment', label: 'Define environment', type: 'text', placeholder: 'The physical or metaphorical space.' },
      { id: 'exists', label: 'What exists?', type: 'textarea', placeholder: 'List the concrete elements of this world.' },
      { id: 'repeats', label: 'What repeats?', type: 'textarea', description: 'Define 3+ rules that maintain order.', placeholder: '1. ...\n2. ...\n3. ...' },
      { id: 'notBelong', label: 'What does not belong?', type: 'text', placeholder: 'Contaminants to the system.' }
    ],
    [
      { id: 'lighting', label: 'Lighting', type: 'text', placeholder: 'Shadows, intensity, source.' },
      { id: 'color', label: 'Color', type: 'text', placeholder: 'Specific palette constraints.' },
      { id: 'composition', label: 'Composition', type: 'text', placeholder: 'Framing and structural rules.' },
      { id: 'styling', label: 'Styling', type: 'text', placeholder: 'Textures and surface details.' },
      { id: 'repeatablePattern', label: 'One repeatable visual pattern', type: 'text', placeholder: 'e.g. 45-degree crosshatching on all edges.' }
    ],
    [
      { id: 'evolves', label: 'What evolves?', type: 'textarea' },
      { id: 'revealed', label: 'What gets revealed?', type: 'textarea' },
      { id: 'continues', label: 'What continues?', type: 'textarea' }
    ],
    [
      { id: 'repeatsAcross', label: 'What repeats across content?', type: 'textarea' },
      { id: 'staysConsistent', label: 'What stays consistent?', type: 'textarea' }
    ],
    [
      { id: 'mirror', label: 'Mirror (familiar)', type: 'textarea', description: 'The hook that reflects common reality.' },
      { id: 'reveal', label: 'Reveal (new)', type: 'textarea', description: 'The underlying truth your system uncovers.' },
      { id: 'close', label: 'Close (action)', type: 'textarea', description: 'The finality of the narrative loop.' }
    ],
    [
      { id: 'contentFlow', label: 'Content flow structure', type: 'textarea' },
      { id: 'postFormat', label: 'Post format system', type: 'textarea' }
    ],
    [
      { id: 'idea', label: 'Start an idea or blank slate', type: 'textarea', placeholder: 'Input a seed thought...' }
    ],
    [
      { id: 'hook', label: 'Hook', type: 'text' },
      { id: 'curiosity', label: 'Curiosity', type: 'text' },
      { id: 'close', label: 'Close', type: 'text' },
      { id: 'decisionQuestion', label: 'Direct decision question', type: 'text', placeholder: 'Must include a "?"' }
    ]
  ];
  return fields[index] || [];
}

// --- PHASE 1: IDENTITY COMPONENT ---

const REQUIRED_SECTIONS = ['identity', 'definition', 'emotional', 'roles'];

function Phase1Identity({ data, onSave, isLocked, isDevMode, navMode }: { data: any, onSave: (data: any) => void, isLocked: boolean, isDevMode?: boolean, navMode: 'REVIEW' | 'BUILD' }) {
  const [form, setForm] = useState<any>({
    identityType: data.phase1?.identityType || '',
    identityTypeDefinition: data.phase1?.identityTypeDefinition || '',
    neverBe: data.phase1?.neverBe || '',
    notSay: data.phase1?.notSay || '',
    notRepresent: data.phase1?.notRepresent || '',
    refuse: data.phase1?.refuse || '',
    emotionalSignature: data.phase1?.emotionalSignature || '',
    dominantRole: data.phase1?.dominantRole || '',
    supportingRoles: data.phase1?.supportingRoles || [],
    roleDefinition: data.phase1?.roleDefinition || '',
    supportingBehavior: data.phase1?.supportingBehavior || ''
  });

  const [validating, setValidating] = useState(false);
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'PASS' | 'FAIL' | null>>({});

  const isBuildMode = navMode === 'BUILD';

  const validateSection = async (sectionId: string, fields: string[]) => {
    if (!isBuildMode) return;
    if (isDevMode) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'PASS' }));
      return;
    }

    setValidating(true);
    const sectionData = fields.map(f => form[f]).join(" ");
    
    // Check for requiredness
    if (fields.some(f => !form[f] || (Array.isArray(form[f]) && form[f].length === 0))) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
      setValidating(false);
      return;
    }

    // Custom validation for Section 1/Section 2
    if (sectionId === 'identity' || sectionId === 'definition' || sectionId === 'emotional') {
      const blockWords = ['vibe', 'aesthetic', 'unique', 'different', 'creative'];
      const text = form[fields.find(f => typeof form[f] === 'string' && f !== 'identityType') || ''];
      
      const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
      const hasBlockWords = blockWords.some(w => text.toLowerCase().includes(w));
      
      if (sentences.length < 2 && sectionId !== 'emotional') {
        setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
        setValidating(false);
        return;
      }

      if (hasBlockWords) {
        setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
        setValidating(false);
        return;
      }
    }

    // AI Check
    const result = await analyzeSystemInput(sectionData);
    setSectionStatus(prev => ({ ...prev, [sectionId]: result.passed ? 'PASS' : 'FAIL' }));
    setValidating(false);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const allPassed = REQUIRED_SECTIONS.every(s => sectionStatus[s] === 'PASS');
    if (isDevMode || (isBuildMode && allPassed)) {
      await onSave({ phase1: form });
    }
  };

  const isReadyToLock = isDevMode || (isBuildMode && REQUIRED_SECTIONS.every(s => sectionStatus[s] === 'PASS'));

  const identityTypes = [
    {
      id: 'AI Twin',
      description: 'An AI Twin is a character closely connected to you. It may look like you or behave like you. It feels like an extension of your real identity.',
      controls: 'This controls proximity to the creator and how personally tied the identity feels.',
      apply: 'Choose a type that matches how close or separate the character should be from you.',
      failure: 'If unclear, the identity becomes unstable or generic.',
      todo: 'Select and define one identity type clearly.',
      todoDef: 'What to do is choosing a defined identity structure instead of blending multiple unclear types.',
      bot: 'Use the bot to detect unclear or mixed identity types.',
      botDef: 'Bot application is identifying confusion in identity structure and forcing clarity.',
      action: 'Choose one identity type and define it in your own words.',
      actionDef: 'An action step is one enforced identity decision.'
    },
    {
      id: 'Alter Character',
      description: 'An Alter Character is inspired by you but not fully tied to you. It allows more creative freedom while still feeling personal.',
      controls: 'This controls proximity to the creator and how personally tied the identity feels.',
      apply: 'Choose a type that matches how close or separate the character should be from you.',
      failure: 'If unclear, the identity becomes unstable or generic.',
      todo: 'Select and define one identity type clearly.',
      todoDef: 'What to do is choosing a defined identity structure instead of blending multiple unclear types.',
      bot: 'Use the bot to detect unclear or mixed identity types.',
      botDef: 'Bot application is identifying confusion in identity structure and forcing clarity.',
      action: 'Choose one identity type and define it in your own words.',
      actionDef: 'An action step is one enforced identity decision.'
    },
    {
      id: 'Fully Original',
      description: 'A Fully Original character is not based on you. It can be fictional, non-human, or conceptual.',
      controls: 'This controls proximity to the creator and how personally tied the identity feels.',
      apply: 'Choose a type that matches how close or separate the character should be from you.',
      failure: 'If unclear, the identity becomes unstable or generic.',
      todo: 'Select and define one identity type clearly.',
      todoDef: 'What to do is choosing a defined identity structure instead of blending multiple unclear types.',
      bot: 'Use the bot to detect unclear or mixed identity types.',
      botDef: 'Bot application is identifying confusion in identity structure and forcing clarity.',
      action: 'Choose one identity type and define it in your own words.',
      actionDef: 'An action step is one enforced identity decision.'
    }
  ];

  const roles = [
    { 
      title: 'Architect', 
      description: 'Builds systems, structure, and direction.',
      apply: 'Choose one dominant role and assign supporting roles.',
      failure: 'If all roles compete, identity becomes scattered.',
      todo: 'Define role hierarchy.',
      todoDef: 'What to do is assigning structure to how the character functions.',
      bot: 'Use the bot to detect conflicting roles.',
      botDef: 'Bot application is identifying role conflict and forcing hierarchy.',
      action: 'Choose 1 dominant + 2 supporting roles.',
      actionDef: 'An action step is one enforced role hierarchy.'
    },
    { 
      title: 'Observer', 
      description: 'Recognizes patterns and shifts.',
      apply: 'Choose one dominant role and assign supporting roles.',
      failure: 'If all roles compete, identity becomes scattered.',
      todo: 'Define role hierarchy.',
      todoDef: 'What to do is assigning structure to how the character functions.',
      bot: 'Use the bot to detect conflicting roles.',
      botDef: 'Bot application is identifying role conflict and forcing hierarchy.',
      action: 'Choose 1 dominant + 2 supporting roles.',
      actionDef: 'An action step is one enforced role hierarchy.'
    },
    { 
      title: 'Operator', 
      description: 'Executes consistently and creates output.',
      apply: 'Choose one dominant role and assign supporting roles.',
      failure: 'If all roles compete, identity becomes scattered.',
      todo: 'Define role hierarchy.',
      todoDef: 'What to do is assigning structure to how the character functions.',
      bot: 'Use the bot to detect conflicting roles.',
      botDef: 'Bot application is identifying role conflict and forcing hierarchy.',
      action: 'Choose 1 dominant + 2 supporting roles.',
      actionDef: 'An action step is one enforced role hierarchy.'
    },
    { 
      title: 'Distorter', 
      description: 'Breaks expectations to prevent predictability.',
      apply: 'Choose one dominant role and assign supporting roles.',
      failure: 'If all roles compete, identity becomes scattered.',
      todo: 'Define role hierarchy.',
      todoDef: 'What to do is assigning structure to how the character functions.',
      bot: 'Use the bot to detect conflicting roles.',
      botDef: 'Bot application is identifying role conflict and forcing hierarchy.',
      action: 'Choose 1 dominant + 2 supporting roles.',
      actionDef: 'An action step is one enforced role hierarchy.'
    },
    { 
      title: 'Curator', 
      description: 'Removes what does not belong and refines the system.',
      apply: 'Choose one dominant role and assign supporting roles.',
      failure: 'If all roles compete, identity becomes scattered.',
      todo: 'Define role hierarchy.',
      todoDef: 'What to do is assigning structure to how the character functions.',
      bot: 'Use the bot to detect conflicting roles.',
      botDef: 'Bot application is identifying role conflict and forcing hierarchy.',
      action: 'Choose 1 dominant + 2 supporting roles.',
      actionDef: 'An action step is one enforced role hierarchy.'
    }
  ];

  return (
    <div id="phase-1" className="space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700 scroll-mt-24">
      {/* HEADER */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase font-black tracking-[4px] text-ww-cyan">PHASE 1 PROTOCOL</span>
        <h2 className="text-6xl font-black tracking-tighter leading-none italic uppercase">IDENTITY</h2>
        <p className="text-white/60 font-medium">Define what your system embodies, rejects, and repeats.</p>
      </div>

      {/* SECTION 1 — IDENTITY TYPE */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40">🪞 SECTION 1 — IDENTITY TYPE</h3>
          {isBuildMode && sectionStatus.identity && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.identity === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.identity}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {identityTypes.map(type => (
            <button
              key={type.id}
              type="button"
              disabled={isLocked && isBuildMode}
              onClick={() => {
                setForm((prev: any) => ({ ...prev, identityType: type.id }));
                setSectionStatus(prev => ({ ...prev, identity: null }));
              }}
              className={cn(
                "p-8 text-left border transition-all space-y-6 relative group",
                form.identityType === type.id 
                  ? "bg-white/5 border-ww-cyan shadow-[0_0_30px_rgba(78,205,196,0.1)]" 
                  : "bg-transparent border-white/10 hover:border-white/30"
              )}
            >
        <h4 className="text-xl font-black tracking-tight italic">🪞 {type.id}</h4>
              <p className="text-xs text-white/50 leading-relaxed font-medium">{type.description}</p>
              
              <div className="pt-4 space-y-6">
                <MethodItem title="What this controls" content={type.controls} />
                <MethodItem title="How to apply it" content={type.apply} />
                <MethodItem title="Failure point" content={type.failure} />
                <MethodItem title="What to do" content={type.todo} />
                <MethodItem title="Definition — What to do" content={type.todoDef} />
                <MethodItem title="Bot application" content={type.bot} />
                <MethodItem title="Definition — Bot application" content={type.botDef} />
                <MethodItem title="Action step" content={type.action} />
                <MethodItem title="Definition — Action step" content={type.actionDef} />
              </div>

              {form.identityType === type.id && (
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-ww-cyan animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {isBuildMode && form.identityType && (
          <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-top-4">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-black tracking-widest text-ww-cyan/60">Define your identity based on this type</label>
              <textarea
                value={form.identityTypeDefinition}
                onChange={(e) => setForm((prev: any) => ({ ...prev, identityTypeDefinition: e.target.value }))}
                onBlur={() => validateSection('identity', ['identityType', 'identityTypeDefinition'])}
                className="w-full bg-white/5 border border-white/10 p-6 text-white/90 font-medium focus:outline-none focus:border-ww-pink-rose transition-colors min-h-[120px]"
                placeholder="Write at least 2 sentences. Focus on behavior or structure. Avoid: vibe, aesthetic, unique..."
              />
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2 — IDENTITY DEFINITION */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40">⭕️ SECTION 2 — IDENTITY DEFINITION</h3>
          {isBuildMode && sectionStatus.definition && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.definition === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.definition}
            </span>
          )}
        </div>

        <div className="space-y-8 max-w-3xl">
          <h4 className="text-2xl font-black italic tracking-tighter">⭕️ Define Identity By Elimination First</h4>
          <p className="text-white/60 font-medium italic">Before defining what the identity is, define what it is NOT.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MethodItem title="What this controls" content="Clarity and distinction." />
            <MethodItem title="How to apply it" content="Define clear exclusions before defining what the character is." />
            <MethodItem title="Failure point" content="If skipped, identity becomes broad and overlaps with others." />
            <MethodItem title="What to do" content="List what does not belong before defining what does." />
            <MethodItem title="Definition — What to do" content="What to do is narrowing identity through exclusion." />
            <MethodItem title="Bot application" content="Use the bot to detect overlap or generic identity." />
            <MethodItem title="Definition — Bot application" content="Bot application is identifying lack of distinction and forcing separation." />
            <MethodItem title="Action step" content="Write clear exclusions for each category." />
            <MethodItem title="Definition — Action step" content="An action step is one enforced elimination." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <BuildInput
            label="What your character is NOT"
            description="Failure point: If unclear or overlapping, identity loses distinction."
            value={form.neverBe}
            mode={navMode}
            onChange={(val) => setForm((prev: any) => ({ ...prev, neverBe: val }))}
            onBlur={() => validateSection('definition', ['neverBe', 'notSay', 'notRepresent', 'refuse'])}
          />
          <BuildInput
            label="What your character does NOT say"
            description="Failure point: If undefined, tone becomes inconsistent."
            value={form.notSay}
            mode={navMode}
            onChange={(val) => setForm((prev: any) => ({ ...prev, notSay: val }))}
          />
          <BuildInput
            label="What your character does NOT represent"
            description="Failure point: If not defined, identity becomes too broad."
            value={form.notRepresent}
            mode={navMode}
            onChange={(val) => setForm((prev: any) => ({ ...prev, notRepresent: val }))}
          />
          <BuildInput
            label="What your character refuses"
            description="Failure point: If missing, identity becomes flexible and weak."
            value={form.refuse}
            mode={navMode}
            onChange={(val) => setForm((prev: any) => ({ ...prev, refuse: val }))}
          />
        </div>

        <div className="p-8 bg-white/2 border border-white/5">
          <h5 className="text-[10px] uppercase font-black tracking-widest text-ww-cyan/40 mb-4 italic">Resulting Property</h5>
          <p className="text-xl font-bold tracking-tight text-white/50">4. This Creates Clarity By Removing Overlap</p>
        </div>
      </section>

      {/* SECTION 3 — EMOTIONAL SIGNATURE */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40">🔥 SECTION 3 — EMOTIONAL SIGNATURE</h3>
          {isBuildMode && sectionStatus.emotional && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.emotional === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.emotional}
            </span>
          )}
        </div>

        <div className="space-y-8 max-w-3xl">
          <p className="text-white/60 font-medium">Emotional Signature is the repeated emotional pattern across your work. It is not invented — it is observed.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MethodItem title="What this controls" content="This controls internal consistency." />
            <MethodItem title="How to apply it" content="Observe patterns instead of inventing new directions." />
            <MethodItem title="Failure point" content="If everything changes, identity becomes unstable." />
            <MethodItem title="What to do" content="Identify repeated emotional patterns." />
            <MethodItem title="Definition — What to do" content="What to do is refining what already exists instead of replacing it." />
            <MethodItem title="Bot application" content="Use the bot to detect recurring emotional patterns." />
            <MethodItem title="Definition — Bot application" content="Bot application is identifying repetition and reinforcing it." />
            <MethodItem title="Action step" content="Review past content and identify repeated emotional tone." />
            <MethodItem title="Definition — Action step" content="An action step is isolating recurring emotional patterns." />
          </div>
          <BuildInput
            label="Identify recurring emotional pattern"
            description="Observe recurring feelings, environments, and tone."
            value={form.emotionalSignature}
            mode={navMode}
            onChange={(val) => setForm((prev: any) => ({ ...prev, emotionalSignature: val }))}
            onBlur={() => validateSection('emotional', ['emotionalSignature'])}
          />
        </div>
      </section>

      {/* SECTION 4 — IDENTITY ROLES */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40">🩷 SECTION 4 — IDENTITY ROLES</h3>
          {isBuildMode && sectionStatus.roles && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.roles === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.roles}
            </span>
          )}
        </div>

        <div className="p-8 bg-ww-pink-deep/5 border border-ww-pink-deep/10 max-w-3xl">
          <h5 className="text-[10px] uppercase font-black tracking-widest text-ww-pink-deep mb-2 italic">Global Failure Point</h5>
          <p className="text-sm font-bold text-white/70 italic leading-relaxed">If multiple roles compete without hierarchy, behavior becomes scattered.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {roles.map(role => (
            <div key={role.title} className="p-6 bg-white/2 border border-white/10 space-y-4 group hover:bg-white/5 transition-all">
              <h5 className="font-black tracking-tighter italic">{role.title}</h5>
              <p className="text-[10px] text-white/40 leading-relaxed font-bold">{role.description}</p>
              
              <div className="space-y-4 pt-2 group-hover:block hidden md:hidden md:group-hover:block">
                <MethodItem title="How to apply it" content={role.apply} />
                <MethodItem title="Failure point" content={role.failure} />
                <MethodItem title="What to do" content={role.todo} />
                <MethodItem title="Definition — What to do" content={role.todoDef} />
                <MethodItem title="Bot application" content={role.bot} />
                <MethodItem title="Definition — Bot application" content={role.botDef} />
                <MethodItem title="Action step" content={role.action} />
                <MethodItem title="Definition — Action step" content={role.actionDef} />
              </div>

              <div className="h-[1px] w-4 bg-ww-cyan/20 group-hover:w-full transition-all" />
              
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setForm((prev: any) => ({ ...prev, dominantRole: role.title }));
                    setSectionStatus(prev => ({ ...prev, roles: null }));
                  }}
                  className={cn(
                    "w-full py-2 text-[8px] font-black tracking-widest border",
                    form.dominantRole === role.title ? "bg-ww-cyan text-ww-charcoal border-ww-cyan" : "text-ww-cyan border-ww-cyan/20 hover:border-ww-cyan"
                  )}
                >
                  [ DOMINANT ]
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const current = form.supportingRoles;
                    const next = current.includes(role.title) 
                      ? current.filter((r: string) => r !== role.title)
                      : current.length < 2 ? [...current, role.title] : current;
                    setForm((prev: any) => ({ ...prev, supportingRoles: next }));
                    setSectionStatus(prev => ({ ...prev, roles: null }));
                  }}
                  className={cn(
                    "w-full py-2 text-[8px] font-black tracking-widest border",
                    form.supportingRoles.includes(role.title) ? "bg-ww-pink-rose text-ww-charcoal border-ww-pink-rose" : "text-ww-pink-rose border-ww-pink-rose/20 hover:border-ww-pink-rose"
                  )}
                >
                  [ SUPPORTING ]
                </button>
              </div>
            </div>
          ))}
        </div>

        {isBuildMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-top-4">
            <BuildInput
              label={`Dominant: ${form.dominantRole || '[CHOOSE]'}`}
              description="Define how this role operates in your system"
              value={form.roleDefinition}
              mode="BUILD"
              onChange={(val) => setForm((prev: any) => ({ ...prev, roleDefinition: val }))}
              onBlur={() => validateSection('roles', ['dominantRole', 'roleDefinition'])}
            />
            <BuildInput
              label={`Supporting: ${form.supportingRoles.join(" & ") || '[CHOOSE UP TO 2]'}`}
              description="Define supporting behavior"
              value={form.supportingBehavior}
              mode="BUILD"
              onChange={(val) => setForm((prev: any) => ({ ...prev, supportingBehavior: val }))}
            />
          </div>
        )}
      </section>

      {/* FINAL LOCK */}
      <div className="pt-20 border-t border-white/10 text-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isReadyToLock || validating}
          className={cn(
            "initialize-btn w-full md:w-[400px] mx-auto flex items-center justify-center gap-3",
            (!isReadyToLock || validating) && "opacity-20 cursor-not-allowed shadow-none translate-y-1"
          )}
        >
          {validating ? <Loader2 className="w-5 h-5 animate-spin" /> : "[ LOCK IDENTITY ]"}
        </button>
        <p className="enforcement-text mt-6">
          {!isBuildMode ? "SYSTEM_LOCKED in REVIEW_MODE — Switch to BUILD_MODE to proceed." : 
          !isReadyToLock ? "ENFORCEMENT_PROTOCOL_ACTIVE // PENDING_PASS_REQS" : "IDENTITY_FOUNDATION_VERIFIED // READY_FOR_SYNC"}
        </p>
      </div>
    </div>
  );
}

// --- PHASE 2: WORLD COMPONENT ---

const P2_REQUIRED_SECTIONS = ['direction', 'rules', 'environment'];

function Phase2World({ data, onSave, isLocked, isDevMode, navMode }: { data: any, onSave: (data: any) => void, isLocked: boolean, isDevMode?: boolean, navMode: 'REVIEW' | 'BUILD' }) {
  const [form, setForm] = useState<any>({
    worldDirection: data.phase2?.worldDirection || '',
    worldDirectionDefinition: data.phase2?.worldDirectionDefinition || '',
    whatExists: data.phase2?.whatExists || '',
    whatNotBelong: data.phase2?.whatNotBelong || '',
    whatRepeats: data.phase2?.whatRepeats || '',
    whatBreaks: data.phase2?.whatBreaks || '',
    ruleCheck: data.phase2?.ruleCheck || '',
    spaceTypes: data.phase2?.spaceTypes || [],
    emotionalTone: data.phase2?.emotionalTone || ''
  });

  const [validating, setValidating] = useState(false);
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'PASS' | 'FAIL' | null>>({});

  const isBuildMode = navMode === 'BUILD';

  const validateSection = async (sectionId: string, fields: string[]) => {
    if (!isBuildMode) return;
    if (isDevMode) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'PASS' }));
      return;
    }

    setValidating(true);
    const sectionData = fields.map(f => {
      const val = form[f];
      return Array.isArray(val) ? val.join(", ") : val;
    }).join(" ");
    
    // Check for requiredness
    if (fields.some(f => !form[f] || (Array.isArray(form[f]) && form[f].length === 0))) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
      setValidating(false);
      return;
    }

    // Custom validation
    if (sectionId === 'direction' || sectionId === 'rules' || sectionId === 'environment') {
       const blockWords = ['vibe', 'aesthetic', 'unique', 'different', 'creative', 'energy'];
       
       if (sectionId === 'environment') {
         if (form.spaceTypes.length < 2 || form.spaceTypes.length > 3) {
            setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
            setValidating(false);
            return;
         }
         const tone = form.emotionalTone.trim();
         // Check for one word (no spaces in middle)
         if (tone === '' || tone.includes(' ') || tone.includes('\n') || blockWords.some(w => tone.toLowerCase().includes(w))) {
            setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
            setValidating(false);
            return;
         }
       }

       if (sectionId === 'direction') {
         const def = form.worldDirectionDefinition.trim();
         const hasBlockWords = blockWords.some(w => def.toLowerCase().includes(w));
         const sentences = def.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
         if (sentences.length < 1 || hasBlockWords) {
            setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
            setValidating(false);
            return;
         }
       }

       if (sectionId === 'rules') {
         const fieldsToCheck = ['whatExists', 'whatNotBelong', 'whatRepeats', 'whatBreaks'];
         for (const f of fieldsToCheck) {
           const val = form[f].trim();
           if (val === '' || blockWords.some(w => val.toLowerCase().includes(w))) {
             setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
             setValidating(false);
             return;
           }

           // Check for minimum items (3 for first two, 1 for others)
           if (f === 'whatExists' || f === 'whatNotBelong') {
             // Split by newlines, commas, or semicolons
             const items = val.split(/[\n,;]+/).filter((i: string) => i.trim().length > 0);
             if (items.length < 3) {
                setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
                setValidating(false);
                return;
             }
           }
         }
       }
    }

    const result = await analyzeSystemInput(sectionData);
    setSectionStatus(prev => ({ ...prev, [sectionId]: result.passed ? 'PASS' : 'FAIL' }));
    setValidating(false);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const allPassed = P2_REQUIRED_SECTIONS.every(s => sectionStatus[s] === 'PASS');
    if (isDevMode || (isBuildMode && allPassed)) {
      await onSave({ phase2: form });
    }
  };

  const isReadyToLock = isDevMode || (isBuildMode && P2_REQUIRED_SECTIONS.every(s => sectionStatus[s] === 'PASS'));

  const worldDirections = [
    {
      id: 'Controlled',
      description: 'Everything feels intentional and placed with purpose. Nothing looks random.',
      controls: 'Precision, order, and visual restraint.',
      apply: 'Apply this direction consistently across all visuals.',
      failure: 'If mixed randomly, the world loses clarity.',
      todo: 'Commit to one direction.',
      todoDef: 'What to do is enforcing one consistent world logic.',
      bot: 'Use the bot to detect conflicting directions.',
      botDef: 'Bot application is identifying inconsistency and forcing alignment.',
      action: 'Choose one direction and apply it across posts.',
      actionDef: 'An action step is one enforced direction choice.'
    },
    {
      id: 'Surreal',
      description: 'Reality is altered. Things do not follow normal logic.',
      controls: 'Distortion, imagination, and unreal visual behavior.',
      apply: 'Apply this direction consistently across all visuals.',
      failure: 'If mixed randomly, the world loses clarity.',
      todo: 'Commit to one direction.',
      todoDef: 'What to do is enforcing one consistent world logic.',
      bot: 'Use the bot to detect conflicting directions.',
      botDef: 'Bot application is identifying inconsistency and forcing alignment.',
      action: 'Choose one direction and apply it across posts.',
      actionDef: 'An action step is one enforced direction choice.'
    },
    {
      id: 'Grounded',
      description: 'The world feels realistic and believable.',
      controls: 'Realism and relatability.',
      apply: 'Apply this direction consistently across all visuals.',
      failure: 'If mixed randomly, the world loses clarity.',
      todo: 'Commit to one direction.',
      todoDef: 'What to do is enforcing one consistent world logic.',
      bot: 'Use the bot to detect conflicting directions.',
      botDef: 'Bot application is identifying inconsistency and forcing alignment.',
      action: 'Choose one direction and apply it across posts.',
      actionDef: 'An action step is one enforced direction choice.'
    },
    {
      id: 'Nostalgic',
      description: 'The world feels like a memory, often warm or slightly faded.',
      controls: 'Emotional memory and softness.',
      apply: 'Apply this direction consistently across all visuals.',
      failure: 'If mixed randomly, the world loses clarity.',
      todo: 'Commit to one direction.',
      todoDef: 'What to do is enforcing one consistent world logic.',
      bot: 'Use the bot to detect conflicting directions.',
      botDef: 'Bot application is identifying inconsistency and forcing alignment.',
      action: 'Choose one direction and apply it across posts.',
      actionDef: 'An action step is one enforced direction choice.'
    },
    {
      id: 'Minimal',
      description: 'The world uses very few elements and focuses on simplicity.',
      controls: 'Restraint and clarity.',
      apply: 'Apply this direction consistently across all visuals.',
      failure: 'If mixed randomly, the world loses clarity.',
      todo: 'Commit to one direction.',
      todoDef: 'What to do is enforcing one consistent world logic.',
      bot: 'Use the bot to detect conflicting directions.',
      botDef: 'Bot application is identifying inconsistency and forcing alignment.',
      action: 'Choose one direction and apply it across posts.',
      actionDef: 'An action step is one enforced direction choice.'
    }
  ];

  const spaceTypes = ['Indoor', 'Outdoor', 'Abstract', 'Digital', 'Nature', 'Architectural'];

  const toneExamples = [
    {
      id: 'Calm',
      description: 'Feels soft, quiet, and still.',
      controls: 'Stillness, softness, peace.',
      apply: 'Use gentle movement, softness, and minimal visual noise.',
      failure: 'If chaotic elements dominate, calm breaks.',
      todo: 'Maintain softness and remove chaotic elements.',
      todoDef: 'What to do is reinforcing stillness through controlled visuals.',
      bot: 'Use the bot to detect chaotic disruptions.',
      botDef: 'Bot application is identifying disruptions and forcing calm alignment.',
      action: 'Remove one chaotic element from your visual.',
      actionDef: 'An action step is one enforced removal that restores tone.'
    },
    {
      id: 'Controlled',
      description: 'Feels structured and intentional.',
      controls: 'Order and precision.',
      apply: 'Use deliberate composition and restraint.',
      failure: 'If randomness enters, control weakens.',
      todo: 'Maintain deliberate and intentional composition.',
      todoDef: 'What to do is reinforcing precision and structure.',
      bot: 'Use the bot to detect randomness.',
      botDef: 'Bot application is identifying lack of control and forcing precision.',
      action: 'Adjust one visual element to be more intentional.',
      actionDef: 'An action step is one enforced adjustment that strengthens control.'
    },
    {
      id: 'Chaotic',
      description: 'Feels unpredictable and active.',
      controls: 'Tension, motion, unpredictability.',
      apply: 'Use movement, distortion, or instability with intention.',
      failure: 'If used without structure, it becomes noise.',
      todo: 'Introduce chaos with controlled intention.',
      todoDef: 'What to do is balancing unpredictability with structure.',
      bot: 'Use the bot to detect when chaos becomes noise.',
      botDef: 'Bot application is identifying lack of structure and forcing control.',
      action: 'Define one rule that chaos must follow.',
      actionDef: 'An action step is one enforced constraint that stabilizes chaos.'
    },
    {
      id: 'Nostalgic',
      description: 'Feels like a memory or past moment.',
      controls: 'Warmth, emotion, memory.',
      apply: 'Use memory-like visual cues consistently.',
      failure: 'If used occasionally without pattern, it feels disconnected.',
      todo: 'Apply nostalgic elements consistently.',
      todoDef: 'What to do is reinforcing memory-based visuals through repetition.',
      bot: 'Use the bot to detect inconsistency.',
      botDef: 'Bot application is identifying breaks in nostalgic tone.',
      action: 'Use one recurring nostalgic element across multiple visuals.',
      actionDef: 'An action step is one enforced repetition that builds continuity.'
    }
  ];

  return (
    <div className="space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* HEADER */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase font-black tracking-[4px] text-ww-cyan">PHASE 2 PROTOCOL</span>
        <h2 className="text-6xl font-black tracking-tighter leading-none italic uppercase">WORLD (ENVIRONMENT)</h2>
        <p className="text-white/60 font-medium">Define how your world behaves overall, what is allowed inside it, and how it feels.</p>
      </div>

      {/* SECTION 1 — WORLD DIRECTION */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40">🪞 SECTION 1 — WORLD DIRECTION</h3>
          {isBuildMode && sectionStatus.direction && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.direction === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.direction}
            </span>
          )}
        </div>

        <div className="space-y-8 max-w-4xl">
           <div className="p-8 bg-white/2 border border-white/10 space-y-6">
             <h4 className="text-2xl font-black italic tracking-tighter">⭕️ World Direction</h4>
             <p className="text-sm text-white/50 leading-relaxed font-medium">World direction defines how your world behaves overall.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <MethodItem title="What this controls" content="The main logic of the world and how everything inside it should feel." />
                <MethodItem title="How to apply it" content="Choose one main world direction and use it as a filter for all future decisions." />
                <MethodItem title="Failure point" content="If multiple directions compete, the world loses clarity." />
                <MethodItem title="What to do" content="Choose one main world direction and commit to it." />
                <MethodItem title="Definition — What to do" content="What to do is the act of selecting a single guiding direction to maintain clarity." />
                <MethodItem title="Bot application" content="Use the bot to detect conflicting directions." />
                <MethodItem title="Definition — Bot application" content="Bot application is identifying competing directions and forcing alignment." />
                <MethodItem title="Action step" content="Choose one: controlled, surreal, grounded, nostalgic, or minimal." />
                <MethodItem title="Definition — Action step" content="An action step is one enforced choice that removes competing directions." />
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {worldDirections.map(dir => (
            <button
              key={dir.id}
              type="button"
              disabled={isLocked && isBuildMode}
              onClick={() => {
                setForm((prev: any) => ({ ...prev, worldDirection: dir.id }));
                setSectionStatus(prev => ({ ...prev, direction: null }));
              }}
              className={cn(
                "p-6 text-left border transition-all space-y-4 relative group",
                form.worldDirection === dir.id 
                  ? "bg-white/5 border-ww-cyan shadow-[0_0_30px_rgba(78,205,196,0.1)]" 
                  : "bg-transparent border-white/10 hover:border-white/30"
              )}
            >
              <h4 className="text-lg font-black tracking-tight italic">{dir.id}</h4>
              <p className="text-[10px] text-white/40 leading-relaxed font-medium">{dir.description}</p>
              
              <div className="pt-2 space-y-4 group-hover:block hidden md:hidden md:group-hover:block">
                <MethodItem title="What this controls" content={dir.controls} />
                <MethodItem title="How to apply it" content={dir.apply} />
                <MethodItem title="Failure point" content={dir.failure} />
                <MethodItem title="What to do" content={dir.todo} />
                <MethodItem title="Definition — What to do" content={dir.todoDef} />
                <MethodItem title="Bot application" content={dir.bot} />
                <MethodItem title="Definition — Bot application" content={dir.botDef} />
                <MethodItem title="Action step" content={dir.action} />
                <MethodItem title="Definition — Action step" content={dir.actionDef} />
              </div>

              {form.worldDirection === dir.id && (
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-ww-cyan animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {isBuildMode && form.worldDirection && (
          <div className="space-y-12 pt-6 animate-in fade-in slide-in-from-top-4">
            <div className="p-8 bg-ww-cyan/5 border-l-2 border-ww-cyan space-y-6">
               <h4 className="text-xl font-black italic tracking-tighter uppercase">Lock Enforcement: You Must Choose One Main</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <MethodItem title="What this controls" content="System unity." />
                  <MethodItem title="How to apply it" content="Use one primary direction as the base." />
                  <MethodItem title="Failure point" content="If you refuse to choose, the world stays undefined." />
                  <MethodItem title="What to do" content="Commit to one direction." />
                  <MethodItem title="Definition — What to do" content="What to do is enforcing alignment through commitment." />
                  <MethodItem title="Bot application" content="Use the bot to detect indecision." />
                  <MethodItem title="Definition — Bot application" content="Bot application is identifying lack of commitment." />
                  <MethodItem title="Action step" content="State your world direction clearly in one sentence." />
                  <MethodItem title="Definition — Action step" content="An action step is one enforced definition that locks direction." />
               </div>
            </div>

            <BuildInput
              label="Define your world direction in one sentence"
              description="Minimum 1 sentence. Must describe behavior, structure, or feeling. Avoid vague words."
              value={form.worldDirectionDefinition}
              mode={navMode}
              onChange={(val) => setForm((prev: any) => ({ ...prev, worldDirectionDefinition: val }))}
              onBlur={() => validateSection('direction', ['worldDirection', 'worldDirectionDefinition'])}
            />
          </div>
        )}
      </section>

      {/* SECTION 2 — WORLD RULES */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40">🔥 SECTION 2 — WORLD RULES</h3>
          {isBuildMode && sectionStatus.rules && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.rules === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.rules}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="space-y-8">
              <div className="space-y-4">
                 <h4 className="text-xl font-black italic tracking-tighter">🪞 What Exist</h4>
                 <div className="space-y-4 text-[10px] text-white/40 font-medium leading-relaxed">
                   <p><span className="text-ww-cyan opacity-100 uppercase tracking-widest font-black">Controls:</span> Inclusion.</p>
                   <p><span className="text-ww-cyan opacity-100 uppercase tracking-widest font-black">Method:</span> List what is allowed to appear repeatedly.</p>
                   <p><span className="text-ww-cyan opacity-100 uppercase tracking-widest font-black">Failure:</span> world becomes too open.</p>
                 </div>
              </div>
              <BuildInput
                label="List 3 things that are always allowed in your world"
                value={form.whatExists}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, whatExists: val }))}
                onBlur={() => validateSection('rules', ['whatExists', 'whatNotBelong', 'whatRepeats', 'whatBreaks', 'ruleCheck'])}
              />
           </div>

           <div className="space-y-8">
              <div className="space-y-4">
                 <h4 className="text-xl font-black italic tracking-tighter">🩷 What Does NOT Belong</h4>
                 <div className="space-y-4 text-[10px] text-white/40 font-medium leading-relaxed">
                   <p><span className="text-ww-cyan opacity-100 uppercase tracking-widest font-black">Controls:</span> Exclusion.</p>
                   <p><span className="text-ww-cyan opacity-100 uppercase tracking-widest font-black">Method:</span> List what is not allowed, even if it looks appealing.</p>
                   <p><span className="text-ww-cyan opacity-100 uppercase tracking-widest font-black">Failure:</span> world has no real boundaries.</p>
                 </div>
              </div>
              <BuildInput
                label="List 3 things that are not allowed"
                value={form.whatNotBelong}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, whatNotBelong: val }))}
              />
           </div>

           <div className="space-y-8">
              <div className="space-y-4">
                 <h4 className="text-xl font-black italic tracking-tighter">❤️‍🔥 What Repeats</h4>
                 <div className="space-y-4 text-[10px] text-white/40 font-medium leading-relaxed">
                   <p><span className="text-ww-cyan opacity-100 uppercase tracking-widest font-black">Controls:</span> Recognition.</p>
                   <p><span className="text-ww-cyan opacity-100 uppercase tracking-widest font-black">Method:</span> Define recurring visuals, environments, energies, signals.</p>
                   <p><span className="text-ww-cyan opacity-100 uppercase tracking-widest font-black">Failure:</span> world doesn’t become learnable.</p>
                 </div>
              </div>
              <BuildInput
                label="Define recurring elements"
                value={form.whatRepeats}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, whatRepeats: val }))}
              />
           </div>

           <div className="space-y-8">
              <div className="space-y-4">
                 <h4 className="text-xl font-black italic tracking-tighter">⭕️ What Breaks The World</h4>
                 <div className="space-y-4 text-[10px] text-white/40 font-medium leading-relaxed">
                   <p><span className="text-ww-cyan opacity-100 uppercase tracking-widest font-black">Controls:</span> Integrity.</p>
                   <p><span className="text-ww-cyan opacity-100 uppercase tracking-widest font-black">Method:</span> Ask what would instantly make the world feel wrong.</p>
                   <p><span className="text-ww-cyan opacity-100 uppercase tracking-widest font-black">Failure:</span> contradictions go unnoticed.</p>
                 </div>
              </div>
              <BuildInput
                label="List one element that breaks the world"
                value={form.whatBreaks}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, whatBreaks: val }))}
              />
           </div>
        </div>

        <div className="space-y-8 pt-8">
           <div className="p-8 bg-ww-pink-rose/5 border border-ww-pink-rose/10 space-y-6">
             <h4 className="text-xl font-black italic tracking-tighter uppercase">World Rules</h4>
             <p className="text-sm text-white/50 leading-relaxed font-medium">World rules define what exists, repeats, and does not belong.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <MethodItem title="What this controls" content="Long-term stability and boundaries." />
                <MethodItem title="How to apply it" content="Define clear inclusion and exclusion." />
                <MethodItem title="Failure point" content="Without rules, the world becomes random." />
                <MethodItem title="What to do" content="Set boundaries." />
                <MethodItem title="Definition — What to do" content="What to do is establishing controlled structure." />
                <MethodItem title="Bot application" content="Use the bot to detect inconsistency." />
                <MethodItem title="Definition — Bot application" content="Bot application is identifying broken logic." />
                <MethodItem title="Action step" content="Define 3 rules." />
                <MethodItem title="Definition — Action step" content="An action step is one enforced rule." />
             </div>
           </div>
           
           {isBuildMode && (
             <BuildInput
                label="Check one piece of content against your rules before posting"
                value={form.ruleCheck}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, ruleCheck: val }))}
             />
           )}
        </div>
      </section>

      {/* SECTION 3 — ENVIRONMENT */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40">🩷 SECTION 3 — ENVIRONMENT</h3>
          {isBuildMode && sectionStatus.environment && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.environment === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.environment}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="space-y-8">
              <h4 className="text-xl font-black italic tracking-tighter">🩷 Types Of Spaces</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[10px] text-white/40 font-medium">
                  <MethodItem title="What this controls" content="Setting consistency." />
                  <MethodItem title="How to apply it" content="Choose the kinds of spaces your world uses most often." />
                  <MethodItem title="Failure point" content="If setting changes constantly, the world feels disconnected." />
                  <MethodItem title="Action step" content="Choose 2–3 space types your world will use repeatedly." />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 {spaceTypes.map(type => (
                   <button
                     key={type}
                     type="button"
                     disabled={isLocked && isBuildMode}
                     onClick={() => {
                        const current = form.spaceTypes;
                        const next = current.includes(type)
                           ? current.filter((t: string) => t !== type)
                           : current.length < 3 ? [...current, type] : current;
                        setForm((prev: any) => ({ ...prev, spaceTypes: next }));
                        setSectionStatus(prev => ({ ...prev, environment: null }));
                     }}
                     className={cn(
                       "py-3 text-[10px] font-black tracking-widest border transition-all",
                       form.spaceTypes.includes(type) ? "bg-ww-cyan text-ww-charcoal border-ww-cyan" : "text-white/40 border-white/10 hover:border-white/30"
                     )}
                   >
                     {type}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-8">
              <h4 className="text-xl font-black italic tracking-tighter">Emotional Tone</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[10px] text-white/40 font-medium">
                  <MethodItem title="What this controls" content="The emotional response the world creates." />
                  <MethodItem title="How to apply it" content="Choose one dominant feeling and make sure visuals reinforce it." />
                  <MethodItem title="Failure point" content="If emotional tone shifts randomly, the world becomes unstable." />
                  <MethodItem title="Action step" content="Define one word that describes your world’s emotional tone." />
              </div>
              <BuildInput
                label="Define one word that describes your world’s emotional tone"
                description="ONE word only. Must be a feeling/tone. No vague words."
                value={form.emotionalTone}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, emotionalTone: val }))}
                onBlur={() => validateSection('environment', ['spaceTypes', 'emotionalTone'])}
              />
           </div>
        </div>

        <div className="space-y-8 pt-8">
           <h4 className="text-xs font-black tracking-[4px] text-white/20 uppercase">Emotional Tone Examples</h4>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {toneExamples.map(example => (
                <div key={example.id} className="p-6 border border-white/5 space-y-4 group">
                   <h5 className="font-black italic tracking-tighter">{example.id}</h5>
                   <p className="text-[10px] text-white/40 leading-relaxed">{example.description}</p>
                   <div className="space-y-4 pt-2 group-hover:block hidden md:hidden md:group-hover:block">
                      <MethodItem title="What this controls" content={example.controls} />
                      <MethodItem title="How to apply it" content={example.apply} />
                      <MethodItem title="Failure point" content={example.failure} />
                      <MethodItem title="Action step" content={example.action} />
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="p-8 bg-white/2 border border-white/5 space-y-6">
           <h4 className="text-[10px] uppercase font-black tracking-widest text-ww-cyan/40 italic">Consistency Protocol</h4>
           <p className="text-xl font-bold tracking-tight text-white/50">If Tone Changes Randomly, The World Becomes Inconsistent</p>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 opacity-40">
              <MethodItem title="What this controls" content="Emotional consistency." />
              <MethodItem title="How to apply it" content="Check every visual against the chosen tone." />
              <MethodItem title="Failure point" content="Random tone shifts weaken identity." />
              <MethodItem title="Action step" content="Review one piece of content and confirm it matches your tone." />
           </div>
        </div>
      </section>

      {/* FINAL LOCK */}
      <div className="pt-20 border-t border-white/10 text-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isReadyToLock || validating}
          className={cn(
            "initialize-btn w-full md:w-[400px] mx-auto flex items-center justify-center gap-3",
            (!isReadyToLock || validating) && "opacity-20 cursor-not-allowed shadow-none translate-y-1"
          )}
        >
          {validating ? <Loader2 className="w-5 h-5 animate-spin" /> : "[ LOCK WORLD ]"}
        </button>
        <p className="enforcement-text mt-6">
          {!isBuildMode ? "SYSTEM_LOCKED in REVIEW_MODE — Switch to BUILD_MODE to proceed." : 
          !isReadyToLock ? "ENFORCEMENT_PROTOCOL_ACTIVE // PENDING_PASS_REQS" : "WORLD_SYNC_COMPLETE // READY_FOR_VISUALS"}
        </p>
      </div>
    </div>
  );
}

// --- PHASE 3: VISUAL COMPONENT ---

const P3_REQUIRED_SECTIONS = ['direction', 'properties', 'references', 'extraction', 'ownership', 'styling'];

function Phase3Visual({ data, onSave, isLocked, isDevMode, navMode }: { data: any, onSave: (data: any) => void, isLocked: boolean, isDevMode?: boolean, navMode: 'REVIEW' | 'BUILD' }) {
  const [form, setForm] = useState<any>({
    baseDirection: data.phase3?.baseDirection || '',
    visualProperties: {
      colorBehavior: data.phase3?.visualProperties?.colorBehavior || '',
      tone: data.phase3?.visualProperties?.tone || '',
      stylingDirection: data.phase3?.visualProperties?.stylingDirection || '',
      energy: data.phase3?.visualProperties?.energy || '',
    },
    pinterestSearch: data.phase3?.pinterestSearch || '',
    referenceCollection: {
      savedImages: data.phase3?.referenceCollection?.savedImages || '',
      groupedImages: data.phase3?.referenceCollection?.groupedImages || '',
      outliersRemoved: data.phase3?.referenceCollection?.outliersRemoved || '',
    },
    patternExtraction: {
      lightingBehavior: data.phase3?.patternExtraction?.lightingBehavior || '',
      colorBehavior: data.phase3?.patternExtraction?.colorBehavior || '',
      environmentType: data.phase3?.patternExtraction?.environmentType || '',
      composition: data.phase3?.patternExtraction?.composition || '',
      emotionalFeel: data.phase3?.patternExtraction?.emotionalFeel || '',
    },
    ownershipRule: data.phase3?.ownershipRule || false,
    transformation: {
      lighting: data.phase3?.transformation?.lighting || '',
      color: data.phase3?.transformation?.color || '',
      environment: data.phase3?.transformation?.environment || '',
      composition: data.phase3?.transformation?.composition || '',
      meaning: data.phase3?.transformation?.meaning || '',
    },
    styling: {
      wears: data.phase3?.styling?.wears || '',
      notWears: data.phase3?.styling?.notWears || '',
      signatureElements: data.phase3?.styling?.signatureElements || '',
    },
  });

  const [validating, setValidating] = useState(false);
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'PASS' | 'FAIL' | null>>({});

  const isBuildMode = navMode === 'BUILD';

  const validateSection = async (sectionId: string) => {
    if (!isBuildMode) return;
    if (isDevMode) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'PASS' }));
      return;
    }

    setValidating(true);
    let sectionData = "";

    if (sectionId === 'direction') sectionData = form.baseDirection;
    if (sectionId === 'properties') sectionData = Object.values(form.visualProperties).join(" ");
    if (sectionId === 'references') sectionData = form.pinterestSearch + " " + Object.values(form.referenceCollection).join(" ");
    if (sectionId === 'extraction') sectionData = Object.values(form.patternExtraction).join(" ");
    if (sectionId === 'ownership') sectionData = Object.values(form.transformation).join(" ");
    if (sectionId === 'styling') sectionData = Object.values(form.styling).join(" ");

    // Basic empty check
    if (!sectionData.trim()) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
      setValidating(false);
      return;
    }

    // Specialized check for direction (3 words)
    if (sectionId === 'direction') {
      const words = form.baseDirection.trim().split(/\s+/);
      if (words.length < 3) {
        setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
        setValidating(false);
        return;
      }
    }

    const result = await analyzeSystemInput(sectionData);
    setSectionStatus(prev => ({ ...prev, [sectionId]: result.passed ? 'PASS' : 'FAIL' }));
    setValidating(false);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const allPassed = P3_REQUIRED_SECTIONS.every(s => sectionStatus[s] === 'PASS');
    if (isDevMode || (isBuildMode && allPassed)) {
      await onSave({ phase3: form });
    }
  };

  const isReadyToLock = isDevMode || (isBuildMode && P3_REQUIRED_SECTIONS.every(s => sectionStatus[s] === 'PASS'));

  return (
    <div className="space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700 uppercase">
      {/* HEADER */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase font-black tracking-[4px] text-ww-cyan">PHASE 3 PROTOCOL</span>
        <h2 className="text-6xl font-black tracking-tighter leading-none italic uppercase">VISUAL LANGUAGE</h2>
        <p className="text-white/60 font-medium normal-case">Define how your world looks, behaves, and becomes recognizable.</p>
      </div>

      {/* SECTION 1 — BASE DIRECTION */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40 italic">🪞 SECTION 1 — BASE DIRECTION</h3>
          {isBuildMode && sectionStatus.direction && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.direction === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.direction}
            </span>
          )}
        </div>

        <div className="space-y-8 max-w-4xl">
           <div className="p-8 bg-white/2 border border-white/10 space-y-6">
             <h4 className="text-2xl font-black italic tracking-tighter">🪞 Base Direction</h4>
             <p className="text-sm text-white/50 leading-relaxed font-medium normal-case">Base direction defines visual intent before reference collection.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <MethodItem title="What this controls" content="Search direction and prevents random inspiration gathering." />
                <MethodItem title="How to apply it" content="Define before searching." />
                <MethodItem title="Failure point" content="Pinterest decides direction instead of you." />
                <MethodItem title="What to do" content="Set direction first." />
                <MethodItem title="Definition — What to do" content="What to do is controlling input before gathering." />
                <MethodItem title="Bot application" content="Use the bot to detect undefined direction." />
                <MethodItem title="Definition — Bot application" content="Bot application is identifying lack of intent." />
                <MethodItem title="Action step" content="Write 3 defining words." />
                <MethodItem title="Definition — Action step" content="An action step is one enforced visual direction." />
             </div>
           </div>

           <BuildInput
              label="Identify visual direction (3 Words)"
              description="Minimum 3 specific words. Avoid vague terms like 'aesthetic' or 'cool'."
              value={form.baseDirection}
              mode={navMode}
              onChange={(val) => setForm((prev: any) => ({ ...prev, baseDirection: val }))}
              onBlur={() => validateSection('direction')}
            />
        </div>
      </section>

      {/* SECTION 2 — VISUAL PROPERTIES */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40 italic">⭕️ SECTION 2 — VISUAL PROPERTIES</h3>
          {isBuildMode && sectionStatus.properties && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.properties === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.properties}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <MethodItem title="Color Behavior" content="Color behavior is how colors appear and repeat. Controls palette consistency and emotional function." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                <MethodItem title="Failure point" content="If inconsistent, visual identity weakens." />
                <MethodItem title="What to do" content="Repeat the same logic." />
                <MethodItem title="Definition — What to do" content="What to do is reinforcing visual consistency." />
                <MethodItem title="Bot application" content="Use the bot to detect inconsistency." />
                <MethodItem title="Definition — Bot application" content="Bot application is identifying visual drift." />
                <MethodItem title="Action step" content="Choose one rule and repeat it." />
                <MethodItem title="Definition — Action step" content="An action step is one enforced repetition." />
              </div>
              <BuildInput
                label="Define color behavior"
                value={form.visualProperties.colorBehavior}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, visualProperties: { ...prev.visualProperties, colorBehavior: val } }))}
              />
            </div>

            <div className="space-y-8">
              <MethodItem title="Tone" content="Tone is the overall emotional feeling of your visuals. Controls visual feeling and emotional continuity." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                <MethodItem title="Failure point" content="If inconsistent, visual identity weakens." />
                <MethodItem title="What to do" content="Repeat the same logic." />
                <MethodItem title="Definition — What to do" content="What to do is reinforcing visual consistency." />
                <MethodItem title="Bot application" content="Use the bot to detect inconsistency." />
                <MethodItem title="Definition — Bot application" content="Bot application is identifying visual drift." />
                <MethodItem title="Action step" content="Choose one rule and repeat it." />
                <MethodItem title="Definition — Action step" content="An action step is one enforced repetition." />
              </div>
              <BuildInput
                label="Define emotional tone"
                value={form.visualProperties.tone}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, visualProperties: { ...prev.visualProperties, tone: val } }))}
              />
            </div>

            <div className="space-y-8">
              <MethodItem title="Styling Direction" content="Defines clothing, appearance, and overall look. Controls identity of character." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                <MethodItem title="Failure point" content="If inconsistent, visual identity weakens." />
                <MethodItem title="What to do" content="Repeat the same logic." />
                <MethodItem title="Definition — What to do" content="What to do is reinforcing visual consistency." />
                <MethodItem title="Bot application" content="Use the bot to detect inconsistency." />
                <MethodItem title="Definition — Bot application" content="Bot application is identifying visual drift." />
                <MethodItem title="Action step" content="Choose one rule and repeat it." />
                <MethodItem title="Definition — Action step" content="An action step is one enforced repetition." />
              </div>
              <BuildInput
                label="Define styling direction"
                value={form.visualProperties.stylingDirection}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, visualProperties: { ...prev.visualProperties, stylingDirection: val } }))}
              />
            </div>

            <div className="space-y-8">
              <MethodItem title="Energy" content="Energy is how active or calm visuals feel. Controls movement, pace, intensity." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                <MethodItem title="Failure point" content="If inconsistent, visual identity weakens." />
                <MethodItem title="What to do" content="Repeat the same logic." />
                <MethodItem title="Definition — What to do" content="What to do is reinforcing visual consistency." />
                <MethodItem title="Bot application" content="Use the bot to detect inconsistency." />
                <MethodItem title="Definition — Bot application" content="Bot application is identifying visual drift." />
                <MethodItem title="Action step" content="Choose one rule and repeat it." />
                <MethodItem title="Definition — Action step" content="An action step is one enforced repetition." />
              </div>
              <BuildInput
                label="Define visual energy"
                value={form.visualProperties.energy}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, visualProperties: { ...prev.visualProperties, energy: val } }))}
                onBlur={() => validateSection('properties')}
              />
            </div>
        </div>
      </section>

      {/* SECTION 3 — PINTEREST & REFERENCES */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40 italic">🔥 SEARCH & COLLECTION</h3>
          {isBuildMode && sectionStatus.references && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.references === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.references}
            </span>
          )}
        </div>

        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white/2 border border-white/10 space-y-6">
              <h4 className="text-xl font-black italic tracking-tighter italic">🪞 Pinterest Combinations</h4>
              <p className="text-xs text-white/40 leading-relaxed font-bold normal-case">Use combinations: environment + lighting + style | outfit + tone + era. Controls result quality. Failure: searches are too broad.</p>
              <BuildInput
                label="Define your search combinations"
                value={form.pinterestSearch}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, pinterestSearch: val }))}
              />
            </div>

            <div className="space-y-8">
               <MethodItem title="Save Images" content="Gather visuals that match direction. Failure: if everything gets saved, pattern extraction becomes impossible." />
               <BuildInput
                label="Confirm saved images match direction"
                value={form.referenceCollection.savedImages}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, referenceCollection: { ...prev.referenceCollection, savedImages: val } }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
               <MethodItem title="Group Similar Images" content="Organize images by what looks alike. Controls pattern visibility. Failure: patterns stay hidden." />
               <BuildInput
                label="Define your groups"
                value={form.referenceCollection.groupedImages}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, referenceCollection: { ...prev.referenceCollection, groupedImages: val } }))}
              />
            </div>

            <div className="space-y-8">
               <MethodItem title="Remove Outliers" content="Remove images that do not match the pattern. Controls discipline. Failure: outliers weaken the world." />
               <BuildInput
                label="List removed outliers"
                value={form.referenceCollection.outliersRemoved}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, referenceCollection: { ...prev.referenceCollection, outliersRemoved: val } }))}
                onBlur={() => validateSection('references')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — PATTERN EXTRACTION */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40 italic">❤️‍🔥 SECTION 4 — PATTERN EXTRACTION</h3>
          {isBuildMode && sectionStatus.extraction && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.extraction === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.extraction}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <MethodItem title="Lighting Behavior" content="How light appears and affects the image. Controls mood, atmosphere, emphasis. Failure: random lighting weakens the system." />
              <BuildInput
                label="Define extracted lighting behavior"
                value={form.patternExtraction.lightingBehavior}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, patternExtraction: { ...prev.patternExtraction, lightingBehavior: val } }))}
              />
            </div>

            <div className="space-y-8">
              <MethodItem title="Color Behavior" content="How colors repeat and interact. Controls palette logic and emotional continuity. Failure: visuals feel disconnected." />
              <BuildInput
                label="Define extracted color behavior"
                value={form.patternExtraction.colorBehavior}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, patternExtraction: { ...prev.patternExtraction, colorBehavior: val } }))}
              />
            </div>

            <div className="space-y-8">
              <MethodItem title="Environment Type" content="The kind of setting used. Controls setting consistency. Failure: world loses coherence." />
              <BuildInput
                label="Define extracted environment types"
                value={form.patternExtraction.environmentType}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, patternExtraction: { ...prev.patternExtraction, environmentType: val } }))}
              />
            </div>

            <div className="space-y-8">
              <MethodItem title="Composition" content="How elements are arranged. Controls focus and visual rhythm. Failure: images feel unrelated." />
              <BuildInput
                label="Define extracted composition rules"
                value={form.patternExtraction.composition}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, patternExtraction: { ...prev.patternExtraction, composition: val } }))}
              />
            </div>

            <div className="space-y-8">
              <MethodItem title="Emotional Feel" content="The feeling created by the image. Controls emotional recognition. Failure: atmosphere weakens." />
              <BuildInput
                label="Define extracted emotional feel"
                value={form.patternExtraction.emotionalFeel}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, patternExtraction: { ...prev.patternExtraction, emotionalFeel: val } }))}
                onBlur={() => validateSection('extraction')}
              />
            </div>
        </div>
      </section>

      {/* SECTION 5 — OWNERSHIP & TRANSFORMATION */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40 italic">🩷 SECTION 5 — OWNERSHIP & TRANSFORMATION</h3>
          {isBuildMode && sectionStatus.ownership && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.ownership === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.ownership}
            </span>
          )}
        </div>

        <div className="space-y-12">
            <div className="p-8 bg-ww-cyan/5 border border-ww-cyan/20 space-y-6">
               <h4 className="text-2xl font-black italic tracking-tighter">Ownership Rule</h4>
               <p className="text-sm text-white/70 leading-relaxed font-bold normal-case italic">"If the image still looks like its original source, it is not yours yet."</p>
               <div className="flex items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setForm((prev: any) => ({ ...prev, ownershipRule: !prev.ownershipRule }))}
                    className={cn(
                      "px-6 py-3 text-[10px] font-black tracking-widest border transition-all",
                      form.ownershipRule ? "bg-ww-cyan text-ww-charcoal border-ww-cyan" : "text-white/40 border-white/10 hover:border-white/30"
                    )}
                  >
                    {form.ownershipRule ? "[ I ACKNOWLEDGE OWNERSHIP RULES ]" : "[ ACKNOWLEDGE OWNERSHIP RULES ]"}
                  </button>
               </div>
            </div>

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <MethodItem title="Transformation" content="You must change at least one: lighting, color, environment, composition, meaning. Controls world ownership. Failure: world is not yours." />
                  <div className="space-y-6">
                    <BuildInput
                      label="Lighting transformation"
                      value={form.transformation.lighting}
                      mode={navMode}
                      onChange={(val) => setForm((prev: any) => ({ ...prev, transformation: { ...prev.transformation, lighting: val } }))}
                    />
                    <BuildInput
                      label="Color transformation"
                      value={form.transformation.color}
                      mode={navMode}
                      onChange={(val) => setForm((prev: any) => ({ ...prev, transformation: { ...prev.transformation, color: val } }))}
                    />
                     <BuildInput
                      label="Meaning transformation"
                      value={form.transformation.meaning}
                      mode={navMode}
                      onChange={(val) => setForm((prev: any) => ({ ...prev, transformation: { ...prev.transformation, meaning: val } }))}
                      onBlur={() => validateSection('ownership')}
                    />
                  </div>
                </div>
            </div>
        </div>
      </section>

      {/* SECTION 6 — STYLING */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40 italic">STYLING PROTOCOL</h3>
          {isBuildMode && sectionStatus.styling && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.styling === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.styling}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-6">
               <MethodItem title="What The Character Wears" content="Defines clothing patterns. Controls consistency." />
               <div className="grid grid-cols-1 gap-y-4 pt-2">
                  <MethodItem title="Failure point" content="If inconsistent, visual identity weakens." />
                  <MethodItem title="What to do" content="Repeat the same logic." />
                  <MethodItem title="Definition — What to do" content="What to do is reinforcing visual consistency." />
                  <MethodItem title="Bot application" content="Use the bot to detect inconsistency." />
                  <MethodItem title="Definition — Bot application" content="Bot application is identifying visual drift." />
                  <MethodItem title="Action step" content="Choose one rule and repeat it." />
                  <MethodItem title="Definition — Action step" content="An action step is one enforced repetition." />
               </div>
               <BuildInput
                label="Define what character wears"
                value={form.styling.wears}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, styling: { ...prev.styling, wears: val } }))}
              />
            </div>

            <div className="space-y-6">
               <MethodItem title="What They Do NOT Wear" content="Removes inconsistency. Controls exclusion." />
               <div className="grid grid-cols-1 gap-y-4 pt-2">
                  <MethodItem title="Failure point" content="If inconsistent, visual identity weakens." />
                  <MethodItem title="What to do" content="Repeat the same logic." />
                  <MethodItem title="Definition — What to do" content="What to do is reinforcing visual consistency." />
                  <MethodItem title="Bot application" content="Use the bot to detect inconsistency." />
                  <MethodItem title="Definition — Bot application" content="Bot application is identifying visual drift." />
                  <MethodItem title="Action step" content="Choose one rule and repeat it." />
                  <MethodItem title="Definition — Action step" content="An action step is one enforced repetition." />
               </div>
               <BuildInput
                label="Define what character NOT wears"
                value={form.styling.notWears}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, styling: { ...prev.styling, notWears: val } }))}
              />
            </div>

            <div className="space-y-6">
               <MethodItem title="Signature Elements" content="Details that repeat and become recognizable. Controls memorability." />
               <div className="grid grid-cols-1 gap-y-4 pt-2">
                  <MethodItem title="Failure point" content="If inconsistent, visual identity weakens." />
                  <MethodItem title="What to do" content="Repeat the same logic." />
                  <MethodItem title="Definition — What to do" content="What to do is reinforcing visual consistency." />
                  <MethodItem title="Bot application" content="Use the bot to detect inconsistency." />
                  <MethodItem title="Definition — Bot application" content="Bot application is identifying visual drift." />
                  <MethodItem title="Action step" content="Choose one rule and repeat it." />
                  <MethodItem title="Definition — Action step" content="An action step is one enforced repetition." />
               </div>
               <BuildInput
                label="Define signature elements"
                value={form.styling.signatureElements}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, styling: { ...prev.styling, signatureElements: val } }))}
                onBlur={() => validateSection('styling')}
              />
            </div>
        </div>
      </section>

      {/* FINAL LOCK */}
      <div className="pt-20 border-t border-white/10 text-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isReadyToLock || validating}
          className={cn(
            "initialize-btn w-full md:w-[400px] mx-auto flex items-center justify-center gap-3",
            (!isReadyToLock || validating) && "opacity-20 cursor-not-allowed shadow-none translate-y-1"
          )}
        >
          {validating ? <Loader2 className="w-5 h-5 animate-spin" /> : "[ LOCK VISUAL SYSTEM ]"}
        </button>
        <p className="enforcement-text mt-6 normal-case">
          {!isBuildMode ? "SYSTEM_LOCKED in REVIEW_MODE — Switch to BUILD_MODE to proceed." : 
          !isReadyToLock ? "ENFORCEMENT_PROTOCOL_ACTIVE // PENDING_PASS_REQS" : "VISUAL_LANGUAGE_SYNC_COMPLETE // READY_FOR_NARRATIVE"}
        </p>
      </div>
    </div>
  );
}

// --- PHASE 4: VISUAL BEHAVIOR COMPONENT ---

const P4_REQUIRED_SECTIONS = ['pov', 'framing', 'lens', 'movement'];

function Phase4VisualBehavior({ data, onSave, isLocked, isDevMode, navMode }: { data: any, onSave: (data: any) => void, isLocked: boolean, isDevMode?: boolean, navMode: 'REVIEW' | 'BUILD' }) {
  const [form, setForm] = useState<any>({
    pov: {
      type: data.phase4?.pov?.type || '',
      definition: data.phase4?.pov?.definition || '',
    },
    framing: data.phase4?.framing || '',
    lens: {
      primary: data.phase4?.lens?.primary || '',
      secondary: data.phase4?.lens?.secondary || '',
      definition: data.phase4?.lens?.definition || '',
    },
    movement: {
      type: data.phase4?.movement?.type || '',
      definition: data.phase4?.movement?.definition || '',
    },
  });

  const [validating, setValidating] = useState(false);
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'PASS' | 'FAIL' | null>>({});

  const isBuildMode = navMode === 'BUILD';

  const validateSection = async (sectionId: string) => {
    if (!isBuildMode) return;
    if (isDevMode) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'PASS' }));
      return;
    }

    setValidating(true);
    let sectionData = "";
    let errorMsg = "";

    const blockWords = ['vibe', 'aesthetic', 'cinematic', 'cool'];

    if (sectionId === 'pov') {
      if (!form.pov.type) errorMsg = "POV must be selected.";
      else {
        const def = form.pov.definition.trim();
        const sentences = def.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const hasBlockWords = blockWords.some(w => def.toLowerCase().includes(w));
        if (sentences.length < 1 || hasBlockWords) errorMsg = "Define how POV stays consistent across visuals.";
        sectionData = def;
      }
    }

    if (sectionId === 'framing') {
      const def = form.framing.trim();
      const requiredWords = ['centered', 'distant', 'dominant', 'partially hidden'];
      const hasRequiredWord = requiredWords.some(w => def.toLowerCase().includes(w));
      if (!def || !hasRequiredWord) errorMsg = "Framing must define subject positioning clearly.";
      sectionData = def;
    }

    if (sectionId === 'lens') {
      if (!form.lens.primary) errorMsg = "Primary lens must be selected.";
      else {
        const def = form.lens.definition.trim();
        if (!def) errorMsg = "Lens usage must follow a rule, not preference.";
        sectionData = def;
      }
    }

    if (sectionId === 'movement') {
      if (!form.movement.type) errorMsg = "Movement type must be selected.";
      else {
        const def = form.movement.definition.trim();
        if (!def || blockWords.some(w => def.toLowerCase().includes(w))) errorMsg = "Define how movement behaves, not how it feels.";
        sectionData = def;
      }
    }

    if (errorMsg) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
      setValidating(false);
      return;
    }

    const result = await analyzeSystemInput(sectionData);
    setSectionStatus(prev => ({ ...prev, [sectionId]: result.passed ? 'PASS' : 'FAIL' }));
    setValidating(false);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const allPassed = P4_REQUIRED_SECTIONS.every(s => sectionStatus[s] === 'PASS');
    if (isDevMode || (isBuildMode && allPassed)) {
      await onSave({ phase4: form });
    }
  };

  const isReadyToLock = isDevMode || (isBuildMode && P4_REQUIRED_SECTIONS.every(s => sectionStatus[s] === 'PASS'));

  return (
    <div className="space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700 uppercase">
       {/* HEADER */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase font-black tracking-[4px] text-ww-cyan">PHASE 4 PROTOCOL</span>
        <h2 className="text-6xl font-black tracking-tighter leading-none italic uppercase">WORLD RULES (VISUAL BEHAVIOR)</h2>
        <p className="text-white/60 font-medium normal-case">Define how your visuals behave, not just how they look.</p>
      </div>

      {/* SECTION 1 — POV */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40 italic">🪞 SECTION 1 — POV (POINT OF VIEW)</h3>
          {isBuildMode && sectionStatus.pov && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.pov === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.pov}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {['Inside', 'Observing'].map(type => (
             <button
                key={type}
                type="button"
                disabled={isLocked && isBuildMode}
                onClick={() => {
                  setForm((prev: any) => ({ ...prev, pov: { ...prev.pov, type } }));
                  setSectionStatus(prev => ({ ...prev, pov: null }));
                }}
                className={cn(
                  "p-8 text-left border transition-all space-y-4 relative group",
                  form.pov.type === type 
                    ? "bg-white/5 border-ww-cyan shadow-[0_0_30px_rgba(78,205,196,0.1)]" 
                    : "bg-transparent border-white/10 hover:border-white/30"
                )}
             >
                <h4 className="text-2xl font-black italic tracking-tighter">{type === 'Inside' ? '🪞' : type === 'Close' ? '⭕️' : '🩷'} {type}</h4>
                <p className="text-xs text-white/50 leading-relaxed font-bold normal-case italic">
                  {type === 'Inside' ? "Feels like you are inside the world." : "Feels like you are watching the world."}
                </p>
                <div className="pt-2 space-y-4">
                  <MethodItem title="Definition" content="This defines how visuals behave in the system." />
                  <MethodItem title="What this controls" content={type === 'Inside' ? "Immersion and viewer experience." : "Distance and perspective."} />
                  <MethodItem title="How to apply it" content="Keep behavior consistent across content." />
                  <MethodItem title="Failure point" content={type === 'Inside' ? "If inconsistent, the world loses immersion." : "If mixed randomly with inside POV, viewer position becomes unstable."} />
                  <MethodItem title="What to do" content="Define one consistent behavior." />
                  <MethodItem title="Definition — What to do" content="What to do is stabilizing visual behavior." />
                  <MethodItem title="Bot application" content="Use the bot to detect inconsistency." />
                  <MethodItem title="Definition — Bot application" content="Bot application is identifying unstable behavior." />
                  <MethodItem title="Action step" content="Choose one behavior and repeat it." />
                  <MethodItem title="Definition — Action step" content="An action step is one enforced behavior pattern." />
                </div>
                {form.pov.type === type && <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-ww-cyan animate-pulse" />}
             </button>
           ))}
        </div>

        <BuildInput
          label="Define how this POV is maintained in your world"
          description="Minimum 1–2 sentences. Describe consistency (NOT preference). Include repeatable behavior."
          value={form.pov.definition}
          mode={navMode}
          onChange={(val) => setForm((prev: any) => ({ ...prev, pov: { ...prev.pov, definition: val } }))}
          onBlur={() => validateSection('pov')}
        />
      </section>

      {/* SECTION 2 — FRAMING */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40 italic">⭕️ SECTION 2 — FRAMING</h3>
          {isBuildMode && sectionStatus.framing && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.framing === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.framing}
            </span>
          )}
        </div>

        <div className="space-y-8 max-w-4xl">
           <div className="p-8 bg-white/2 border border-white/10 space-y-6">
             <h4 className="text-xl font-black italic tracking-tighter">⭕️ Framing Logic</h4>
             <p className="text-sm text-white/50 leading-relaxed font-medium">This defines how visuals behave in the system.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <MethodItem title="What this controls" content="Focus, power, and perception." />
                <MethodItem title="How to apply it" content="Keep behavior consistent across content." />
                <MethodItem title="Failure point" content="If behavior shifts randomly, the world weakens." />
                <MethodItem title="What to do" content="Define one consistent behavior." />
                <MethodItem title="Definition — What to do" content="What to do is stabilizing visual behavior." />
                <MethodItem title="Bot application" content="Use the bot to detect inconsistency." />
                <MethodItem title="Definition — Bot application" content="Bot application is identifying unstable behavior." />
                <MethodItem title="Action step" content="Choose one behavior and repeat it." />
                <MethodItem title="Definition — Action step" content="An action step is one enforced behavior pattern." />
             </div>
           </div>
           <BuildInput
            label="Define your framing rule"
            description="Must include subject placement logic (centered, distant, dominant, or partially hidden)."
            value={form.framing}
            mode={navMode}
            onChange={(val) => setForm((prev: any) => ({ ...prev, framing: val }))}
            onBlur={() => validateSection('framing')}
          />
        </div>
      </section>

      {/* SECTION 3 — LENS */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40 italic">❤️‍🔥 SECTION 3 — LENS</h3>
          {isBuildMode && sectionStatus.lens && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.lens === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.lens}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
                <div className="flex gap-4">
                  {['Close', 'Wide'].map(l => (
                    <button
                      key={l}
                      type="button"
                      disabled={isLocked && isBuildMode}
                      onClick={() => {
                        setForm((prev: any) => ({ ...prev, lens: { ...prev.lens, primary: l } }));
                        setSectionStatus(prev => ({ ...prev, lens: null }));
                      }}
                      className={cn(
                        "flex-1 py-4 text-[10px] font-black tracking-widest border transition-all",
                        form.lens.primary === l ? "bg-ww-cyan text-ww-charcoal border-ww-cyan shadow-[0_0_20px_rgba(78,205,196,0.1)]" : "text-white/40 border-white/10 hover:border-white/30"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <div className="space-y-4 pt-4">
                   <div className="p-4 border border-white/5 space-y-4">
                      <h5 className="text-[8px] font-black tracking-widest text-ww-cyan italic">CLOSE</h5>
                      <MethodItem title="Definition" content="This defines how visuals behave in the system." />
                      <MethodItem title="What this controls" content="Intimacy and detail." />
                      <MethodItem title="How to apply it" content="Keep behavior consistent across content." />
                      <MethodItem title="Failure point" content="If behavior shifts randomly, the world weakens." />
                      <MethodItem title="What to do" content="Define one consistent behavior." />
                      <MethodItem title="Definition — What to do" content="What to do is stabilizing visual behavior." />
                      <MethodItem title="Bot application" content="Use the bot to detect inconsistency." />
                      <MethodItem title="Definition — Bot application" content="Bot application is identifying unstable behavior." />
                      <MethodItem title="Action step" content="Choose one behavior and repeat it." />
                      <MethodItem title="Definition — Action step" content="An action step is one enforced behavior pattern." />
                   </div>
                   <div className="p-4 border border-white/5 space-y-4">
                      <h5 className="text-[8px] font-black tracking-widest text-ww-cyan italic">WIDE</h5>
                      <MethodItem title="Definition" content="This defines how visuals behave in the system." />
                      <MethodItem title="What this controls" content="Scale and setting visibility." />
                      <MethodItem title="How to apply it" content="Keep behavior consistent across content." />
                      <MethodItem title="Failure point" content="If behavior shifts randomly, the world weakens." />
                      <MethodItem title="What to do" content="Define one consistent behavior." />
                      <MethodItem title="Definition — What to do" content="What to do is stabilizing visual behavior." />
                      <MethodItem title="Bot application" content="Use the bot to detect inconsistency." />
                      <MethodItem title="Definition — Bot application" content="Bot application is identifying unstable behavior." />
                      <MethodItem title="Action step" content="Choose one behavior and repeat it." />
                      <MethodItem title="Definition — Action step" content="An action step is one enforced behavior pattern." />
                   </div>
                </div>
            </div>

            <div className="space-y-8">
              <BuildInput
                label="Define when each lens type is used"
                description="Must include condition (WHEN it is used) and define consistency."
                value={form.lens.definition}
                mode={navMode}
                onChange={(val) => setForm((prev: any) => ({ ...prev, lens: { ...prev.lens, definition: val } }))}
                onBlur={() => validateSection('lens')}
              />
            </div>
        </div>
      </section>

      {/* SECTION 4 — MOVEMENT */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40 italic">🔥 SECTION 4 — MOVEMENT</h3>
          {isBuildMode && sectionStatus.movement && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.movement === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.movement}
            </span>
          )}
        </div>

        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['Still', 'Floating', 'Kinetic', 'Unstable', 'Cinematic'].map(m => (
                <button
                  key={m}
                  type="button"
                  disabled={isLocked && isBuildMode}
                  onClick={() => {
                    setForm((prev: any) => ({ ...prev, movement: { ...prev.movement, type: m } }));
                    setSectionStatus(prev => ({ ...prev, movement: null }));
                  }}
                  className={cn(
                    "py-4 text-[10px] font-black tracking-widest border transition-all",
                    form.movement.type === m ? "bg-ww-cyan text-ww-charcoal border-ww-cyan shadow-[0_0_20px_rgba(78,205,196,0.1)]" : "text-white/40 border-white/10 hover:border-white/30"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
            
            <div className="p-8 bg-white/2 border border-white/10 space-y-6">
              <h4 className="text-xl font-black italic tracking-tighter">Movement Control</h4>
              <p className="text-sm text-white/50 leading-relaxed font-medium">This defines how visuals behave in the system.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <MethodItem title="What this controls" content="Pace and energy." />
                <MethodItem title="How to apply it" content="Keep behavior consistent across content." />
                <MethodItem title="Failure point" content="If behavior shifts randomly, the world weakens." />
                <MethodItem title="What to do" content="Define one consistent behavior." />
                <MethodItem title="Definition — What to do" content="What to do is stabilizing visual behavior." />
                <MethodItem title="Bot application" content="Use the bot to detect inconsistency." />
                <MethodItem title="Definition — Bot application" content="Bot application is identifying unstable behavior." />
                <MethodItem title="Action step" content="Choose one behavior and repeat it." />
                <MethodItem title="Definition — Action step" content="An action step is one enforced behavior pattern." />
              </div>
            </div>

            <BuildInput
              label="Define how movement behaves in your world"
              description="Describe behavior (NOT feeling). Must include repetition or consistency."
              value={form.movement.definition}
              mode={navMode}
              onChange={(val) => setForm((prev: any) => ({ ...prev, movement: { ...prev.movement, definition: val } }))}
              onBlur={() => validateSection('movement')}
            />
        </div>
      </section>

      {/* FINAL LOCK */}
      <div className="pt-20 border-t border-white/10 text-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isReadyToLock || validating}
          className={cn(
            "initialize-btn w-full md:w-[400px] mx-auto flex items-center justify-center gap-3",
            (!isReadyToLock || validating) && "opacity-20 cursor-not-allowed shadow-none translate-y-1"
          )}
        >
          {validating ? <Loader2 className="w-5 h-5 animate-spin" /> : "[ LOCK VISUAL RULES ]"}
        </button>
        <p className="enforcement-text mt-6 normal-case">
          {!isBuildMode ? "SYSTEM_LOCKED in REVIEW_MODE — Switch to BUILD_MODE to proceed." : 
          !isReadyToLock ? "ENFORCEMENT_PROTOCOL_ACTIVE // PENDING_PASS_REQS" : "VISUAL_BEHAVIOR_SYNC_COMPLETE // READY_FOR_NARRATIVE"}
        </p>
      </div>
    </div>
  );
}

// --- PHASE 5: PATTERN SYSTEM COMPONENT ---

const P5_REQUIRED_SECTIONS = ['repetition', 'connection'];

function Phase5PatternSystem({ data, onSave, isLocked, isDevMode, navMode }: { data: any, onSave: (data: any) => void, isLocked: boolean, isDevMode?: boolean, navMode: 'REVIEW' | 'BUILD' }) {
  const [form, setForm] = useState<any>({
    selectedPatterns: data.phase5?.selectedPatterns || [],
    mainDefinition: data.phase5?.mainDefinition || '',
    character: data.phase5?.character || '',
    transformation: data.phase5?.transformation || '',
    structure: data.phase5?.structure || '',
    tone: data.phase5?.tone || '',
    fivePostRule: data.phase5?.fivePostRule || '',
  });

  const [validating, setValidating] = useState(false);
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'PASS' | 'FAIL' | null>>({});
  const [expandedPatterns, setExpandedPatterns] = useState<string[]>(form.selectedPatterns);

  const isBuildMode = navMode === 'BUILD';

  const validateSection = async (sectionId: string) => {
    if (!isBuildMode) return;
    if (isDevMode) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'PASS' }));
      return;
    }

    setValidating(true);
    let sectionData = "";
    let errorMsg = "";

    const blockWords = ['vibe', 'aesthetic', 'random', 'different'];

    if (sectionId === 'repetition') {
      if (form.selectedPatterns.length === 0) {
        errorMsg = "Select at least one pattern.";
      } else {
        const def = form.mainDefinition.trim();
        const hasBlockWords = blockWords.some(w => def.toLowerCase().includes(w));
        if (!def || hasBlockWords) errorMsg = "Define a repeatable pattern, not a general idea.";
        
        // Also validate individual active subsections
        for (const p of form.selectedPatterns) {
          const pKey = p.toLowerCase().replace(/ /g, '');
          const pVal = form[pKey === 'transformationsignals' ? 'transformation' : pKey]?.trim();
          if (!pVal || blockWords.some(w => pVal.toLowerCase().includes(w))) {
             errorMsg = `${p} must have a consistent definition.`;
             break;
          }
        }
        sectionData = def + " " + form.selectedPatterns.join(" ");
      }
    }

    if (sectionId === 'connection') {
      const def = form.fivePostRule.trim();
      if (!def) errorMsg = "No connection detected. Identify a repeating element.";
      sectionData = def;
    }

    if (errorMsg) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
      setValidating(false);
      return;
    }

    const result = await analyzeSystemInput(sectionData);
    setSectionStatus(prev => ({ ...prev, [sectionId]: result.passed ? 'PASS' : 'FAIL' }));
    setValidating(false);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const allPassed = P5_REQUIRED_SECTIONS.every(s => sectionStatus[s] === 'PASS');
    if (isDevMode || (isBuildMode && allPassed)) {
      await onSave({ phase5: form });
    }
  };

  const togglePattern = (id: string) => {
    if (isLocked && isBuildMode) return;
    setForm((prev: any) => {
      const selected = prev.selectedPatterns.includes(id)
        ? prev.selectedPatterns.filter((p: string) => p !== id)
        : [...prev.selectedPatterns, id];
      return { ...prev, selectedPatterns: selected };
    });
    setSectionStatus(prev => ({ ...prev, repetition: null }));
    
    // Auto-expand if selected
    if (!expandedPatterns.includes(id)) {
      setExpandedPatterns(prev => [...prev, id]);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedPatterns(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const isReadyToLock = isDevMode || (isBuildMode && P5_REQUIRED_SECTIONS.every(s => sectionStatus[s] === 'PASS'));

  const patterns = [
    { id: 'Character', controls: 'Continuity of presence.', failure: 'If identity changes too much, recognition breaks.', field: 'character', label: 'Define what stays consistent about the character', description: 'Must include a trait OR behavior repeatable across posts.' },
    { id: 'Transformation Signals', controls: 'How shifts are understood.', failure: 'If transformations have no logic, they feel decorative.', field: 'transformation', label: 'Define how transformation happens in your world', description: 'Must define a rule (NOT random change) including cause or trigger.' },
    { id: 'Structure', controls: 'Familiarity and rhythm.', failure: 'If every post is different, the audience cannot learn the system.', field: 'structure', label: 'Define your repeatable content structure', description: 'Must describe a format (sequence, flow, or layout) that is reusable.' },
    { id: 'Tone', controls: 'Emotional recognition.', failure: 'If tone changes constantly, the system feels scattered.', field: 'tone', label: 'Define the emotional tone that repeats', description: 'Must define ONE consistent tone that matches Phase 2.' }
  ];

  return (
    <div className="space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700 uppercase">
       {/* HEADER */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase font-black tracking-[4px] text-ww-cyan">PHASE 5 PROTOCOL</span>
        <h2 className="text-6xl font-black tracking-tighter leading-none italic uppercase">PATTERN SYSTEM</h2>
        <p className="text-white/60 font-medium normal-case">Define what repeats so your system becomes recognizable.</p>
      </div>

      {/* SECTION 1 — WHAT REPEATS */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40 italic">🪞 SECTION 1 — WHAT REPEATS</h3>
          {isBuildMode && sectionStatus.repetition && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.repetition === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.repetition}
            </span>
          )}
        </div>

        <div className="p-8 bg-white/2 border border-white/10 space-y-6 max-w-4xl">
           <h4 className="text-2xl font-black italic tracking-tighter">⭕️ What Repeats</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <MethodItem title="What this controls" content="Recognition. Repetition teaches the audience how to read the world." />
              <MethodItem title="Failure point" content="If repetition is avoided, nothing becomes memorable." />
              <MethodItem title="What to do" content="Repeat exactly." />
              <MethodItem title="Definition — What to do" content="What to do is reinforcing pattern recognition." />
              <MethodItem title="Bot application" content="Use the bot to detect broken patterns." />
              <MethodItem title="Definition — Bot application" content="Bot application is identifying inconsistency and forcing repetition." />
              <MethodItem title="Action step" content="Repeat one pattern 3 times." />
              <MethodItem title="Definition — Action step" content="An action step is one enforced repetition." />
           </div>
        </div>

        <div className="space-y-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {patterns.map(p => (
                <button
                  key={p.id}
                  type="button"
                  disabled={isLocked && isBuildMode}
                  onClick={() => togglePattern(p.id)}
                  className={cn(
                    "py-4 text-[10px] font-black tracking-widest border transition-all",
                    form.selectedPatterns.includes(p.id) ? "bg-ww-cyan text-ww-charcoal border-ww-cyan shadow-[0_0_20px_rgba(78,205,196,0.1)]" : "text-white/40 border-white/10 hover:border-white/30"
                  )}
                >
                  [{p.id.toUpperCase()}]
                </button>
              ))}
           </div>

           <BuildInput
              label="Define what repeats across your content"
              description="Describe a repeatable pattern (NOT general idea). Must reference consistency."
              value={form.mainDefinition}
              mode={navMode}
              onChange={(val) => setForm((prev: any) => ({ ...prev, mainDefinition: val }))}
              onBlur={() => validateSection('repetition')}
            />
        </div>

        {/* SUBSECTIONS */}
        <div className="space-y-6">
           {patterns.map(p => {
             const isSelected = form.selectedPatterns.includes(p.id);
             const isExpanded = expandedPatterns.includes(p.id);
             
             return (
               <div key={p.id} className={cn("border transition-all", isSelected ? "border-ww-cyan/30" : "border-white/5")}>
                 <button
                   type="button"
                   onClick={() => toggleExpand(p.id)}
                   className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors"
                 >
                   <div className="flex items-center gap-4">
                      <div className={cn("h-2 w-2 rounded-full", isSelected ? "bg-ww-cyan animate-pulse" : "bg-white/10")} />
                      <h4 className="text-sm font-black italic tracking-tighter uppercase">{p.id === 'Character' ? '🪞' : p.id === 'Transformation Signals' ? '⭕️' : p.id === 'Structure' ? '❤️‍🔥' : '🩷'} {p.id}</h4>
                   </div>
                   {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                 </button>

                 <AnimatePresence>
                   {isExpanded && (
                     <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden bg-ww-charcoal/40"
                     >
                       <div className="p-8 space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <MethodItem title="What this controls" content={p.controls} />
                             <MethodItem title="Failure point" content={p.failure} />
                          </div>
                          
                          <BuildInput
                            label={p.label}
                            description={p.description}
                            value={form[p.field]}
                            mode={isSelected ? navMode : 'REVIEW'}
                            onChange={(val) => setForm((prev: any) => ({ ...prev, [p.field]: val }))}
                            onBlur={() => validateSection('repetition')}
                          />
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             );
           })}
        </div>
      </section>

      {/* SECTION 2 — RULE */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40 italic">🔥 SECTION 2 — THE 5-POST RULE</h3>
          {isBuildMode && sectionStatus.connection && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.connection === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.connection}
            </span>
          )}
        </div>

        <div className="p-8 bg-ww-pink-deep/5 border border-ww-pink-deep/20 space-y-6 max-w-4xl">
           <h4 className="text-xl font-black italic tracking-tighter">If nothing repeats across 5 posts, there is no system.</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MethodItem title="What this controls" content="System existence." />
              <MethodItem title="Failure point" content="If nothing connects, the world remains unbuilt." />
           </div>
        </div>

        <BuildInput
          label="Identify what connects your last 5 posts"
          description="Must reference actual repetition and describe a shared pattern."
          value={form.fivePostRule}
          mode={navMode}
          onChange={(val) => setForm((prev: any) => ({ ...prev, fivePostRule: val }))}
          onBlur={() => validateSection('connection')}
        />
      </section>

      {/* FINAL LOCK */}
      <div className="pt-20 border-t border-white/10 text-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isReadyToLock || validating}
          className={cn(
            "initialize-btn w-full md:w-[400px] mx-auto flex items-center justify-center gap-3",
            (!isReadyToLock || validating) && "opacity-20 cursor-not-allowed shadow-none translate-y-1"
          )}
        >
          {validating ? <Loader2 className="w-5 h-5 animate-spin" /> : "[ LOCK PATTERN SYSTEM ]"}
        </button>
        <p className="enforcement-text mt-6 normal-case">
          {!isBuildMode ? "SYSTEM_LOCKED in REVIEW_MODE — Switch to BUILD_MODE to proceed." : 
          !isReadyToLock ? "ENFORCEMENT_PROTOCOL_ACTIVE // PENDING_PASS_REQS" : "PATTERN_SYNC_COMPLETE // READY_FOR_NARRATIVE_ENGINE"}
        </p>
      </div>
    </div>
  );
}

// --- PHASE 6: NARRATIVE ENGINE COMPONENT ---

const P6_REQUIRED_SECTIONS = ['evolution', 'discovery', 'connection'];

function Phase6NarrativeEngine({ data, onSave, isLocked, isDevMode, navMode }: { data: any, onSave: (data: any) => void, isLocked: boolean, isDevMode?: boolean, navMode: 'REVIEW' | 'BUILD' }) {
  const [form, setForm] = useState<any>({
    evolutionType: data.phase6?.evolutionType || '',
    evolutionDefinition: data.phase6?.evolutionDefinition || '',
    discoveryDefinition: data.phase6?.discoveryDefinition || '',
    connectionDefinition: data.phase6?.connectionDefinition || '',
  });

  const [validating, setValidating] = useState(false);
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'PASS' | 'FAIL' | null>>({});
  const [expandedSubsections, setExpandedSubsections] = useState<string[]>(form.evolutionType ? [form.evolutionType] : []);

  const isBuildMode = navMode === 'BUILD';

  const validateSection = async (sectionId: string) => {
    if (!isBuildMode) return;
    if (isDevMode) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'PASS' }));
      return;
    }

    setValidating(true);
    let sectionData = "";
    let errorMsg = "";

    if (sectionId === 'evolution') {
      if (!form.evolutionType) {
        errorMsg = "Evolution type must be selected.";
      } else {
        const def = form.evolutionDefinition.trim();
        if (!def) errorMsg = "Evolution definition is required.";
        // User rules: Evolution builds. It does not replace.
        // Since we only have one for now, we just ensure it's defined.
        sectionData = "Evolution: " + form.evolutionType + " " + def;
      }
    }

    if (sectionId === 'discovery') {
      const def = form.discoveryDefinition.trim();
      if (!def) errorMsg = "Discovery framing is required.";
      sectionData = def;
    }

    if (sectionId === 'connection') {
      const def = form.connectionDefinition.trim().toLowerCase();
      // must include all 3: continuation + reveal + direction
      const hasContinuation = def.includes('continue') || def.includes('continuation');
      const hasReveal = def.includes('reveal');
      const hasDirection = def.includes('lead') || def.includes('direction');
      
      if (!hasContinuation || !hasReveal || !hasDirection) {
        errorMsg = "Content must continue, reveal, and lead. Define all three.";
      }
      sectionData = def;
    }

    if (errorMsg) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
      setValidating(false);
      return;
    }

    const result = await analyzeSystemInput(sectionData);
    setSectionStatus(prev => ({ ...prev, [sectionId]: result.passed ? 'PASS' : 'FAIL' }));
    setValidating(false);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const allPassed = P6_REQUIRED_SECTIONS.every(s => sectionStatus[s] === 'PASS');
    if (isDevMode || (isBuildMode && allPassed)) {
      await onSave({ phase6: form });
    }
  };

  const toggleEvolution = (id: string) => {
    if (isLocked && isBuildMode) return;
    setForm((prev: any) => ({ ...prev, evolutionType: id }));
    setSectionStatus(prev => ({ ...prev, evolution: null }));
    if (!expandedSubsections.includes(id)) {
      setExpandedSubsections(prev => [...prev, id]);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedSubsections(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const isReadyToLock = isDevMode || (isBuildMode && P6_REQUIRED_SECTIONS.every(s => sectionStatus[s] === 'PASS'));

  const evolutionOptions = [
    { 
      id: 'Character', 
      desc: 'Changes or develops. Controls character progression.',
      apply: 'Define what changes in the character over time.',
      failure: 'If the character never evolves, content feels static.',
      todo: 'Establish change so the character does not remain fixed.',
      field: 'evolutionDefinition', 
      label: 'Define one way the character changes over time', 
      description: 'Action Step: One enforced evolution that creates progression.' 
    },
    { 
      id: 'World', 
      desc: 'Shifts or reveals new elements. Controls world expansion.',
      apply: 'Let the world reveal new pieces gradually.',
      failure: 'If nothing in the world changes, it stops feeling alive.',
      todo: 'Expand the world through controlled reveals.',
      field: 'evolutionDefinition', 
      label: 'Add one new element to your world', 
      description: 'Action Step: One enforced addition that expands the world.' 
    },
    { 
      id: 'Patterns', 
      desc: 'Become more visible. Controls understanding and depth.',
      apply: 'Repeat patterns until the audience begins to recognize them.',
      failure: 'If patterns are too hidden or too inconsistent, narrative weakens.',
      todo: 'Reinforce patterns to build understanding.',
      field: 'evolutionDefinition', 
      label: 'Repeat one pattern across multiple posts', 
      description: 'Action Step: One enforced repetition that builds recognition.' 
    }
  ];

  return (
    <div className="space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700 uppercase">
       {/* HEADER */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase font-black tracking-[4px] text-ww-cyan">PHASE 6 PROTOCOL</span>
        <h2 className="text-6xl font-black tracking-tighter leading-none italic uppercase">NARRATIVE ENGINE</h2>
        <p className="text-white/60 font-medium normal-case">Control what evolves, what connects, and how the world reveals itself over time.</p>
      </div>

      {/* SECTION 1 — WHAT EVOLVES */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40 italic">🪞 SECTION 1 — WHAT EVOLVES</h3>
          {isBuildMode && sectionStatus.evolution && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.evolution === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.evolution}
            </span>
          )}
        </div>

        <div className="p-8 bg-white/2 border border-white/10 space-y-6 max-w-4xl">
           <h4 className="text-2xl font-black italic tracking-tighter">⭕️ What Evolves</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <MethodItem title="What this controls" content="This controls how your system stays relevant and avoids stale repetition." />
              <MethodItem title="Failure point" content="If nothing evolves, the world feels dead or static." />
              <MethodItem title="What to do" content="Layer new progression." />
              <MethodItem title="Definition — What to do" content="What to do is adding new logic on top of old patterns." />
              <MethodItem title="Bot application" content="Use the bot to detect stagnation." />
              <MethodItem title="Definition — Bot application" content="Bot application is identifying zero-growth states." />
              <MethodItem title="Action step" content="Define one evolution." />
              <MethodItem title="Definition — Action step" content="An action step is one enforced evolution choice." />
           </div>
        </div>

        <div className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Character', 'World', 'Patterns'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  disabled={isLocked && isBuildMode}
                  onClick={() => toggleEvolution(opt)}
                  className={cn(
                    "py-4 text-[10px] font-black tracking-widest border transition-all",
                    form.evolutionType === opt ? "bg-ww-cyan text-ww-charcoal border-ww-cyan shadow-[0_0_20px_rgba(78,205,196,0.1)]" : "text-white/40 border-white/10 hover:border-white/30"
                  )}
                >
                  [{opt.toUpperCase()}]
                </button>
              ))}
           </div>
        </div>

        {/* EVOLUTION SUBSECTIONS */}
        <div className="space-y-6">
           {evolutionOptions.map(opt => {
             const isSelected = form.evolutionType === opt.id;
             const isExpanded = expandedSubsections.includes(opt.id);
             
             return (
               <div key={opt.id} className={cn("border transition-all", isSelected ? "border-ww-cyan/30" : "border-white/5")}>
                 <button
                   type="button"
                   onClick={() => toggleExpand(opt.id)}
                   className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors"
                 >
                   <div className="flex items-center gap-4">
                      <div className={cn("h-2 w-2 rounded-full", isSelected ? "bg-ww-cyan animate-pulse" : "bg-white/10")} />
                      <h4 className="text-sm font-black italic tracking-tighter uppercase">{opt.id === 'Character' ? '🪞' : opt.id === 'World' ? '⭕️' : '❤️‍🔥'} {opt.id}</h4>
                   </div>
                   {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                 </button>

                 <AnimatePresence>
                   {isExpanded && (
                     <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden bg-ww-charcoal/40"
                     >
                       <div className="p-8 space-y-8">
                          <p className="text-xs text-white/50 italic font-bold normal-case leading-relaxed">{opt.desc}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <MethodItem title="How to apply it" content={opt.apply} />
                            <MethodItem title="Failure point" content={opt.failure} />
                            <MethodItem title="What to do" content={opt.todo} />
                             <MethodItem title="Bot application" content="Identifies stagnation and forces evolution/progression." />
                          </div>
                          
                          <BuildInput
                            label={opt.label}
                            description={opt.description}
                            value={isSelected ? form.evolutionDefinition : ''}
                            mode={isSelected ? navMode : 'REVIEW'}
                            onChange={(val) => setForm((prev: any) => ({ ...prev, evolutionDefinition: val }))}
                            onBlur={() => validateSection('evolution')}
                          />
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             );
           })}
        </div>
      </section>

      {/* SECTION 2 — DISCOVERY FRAMING */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40 italic">🔥 SECTION 2 — DISCOVERY FRAMING</h3>
          {isBuildMode && sectionStatus.discovery && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.discovery === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.discovery}
            </span>
          )}
        </div>

        <div className="p-8 bg-ww-cyan/5 border border-ww-cyan/20 space-y-6 max-w-4xl">
           <h4 className="text-2xl font-black italic tracking-tighter">Discovery Framing</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <MethodItem title="What this controls" content="This controls audience immersion and prevents flat explanation." />
              <MethodItem title="Failure point" content="If explained instead of revealed, the world loses mystery." />
              <MethodItem title="What to do" content="Reveal, don't intro." />
              <MethodItem title="Definition — What to do" content="What to do is presenting the world as already existing." />
              <MethodItem title="Bot application" content="Use the bot to detect 'Intro-speak.'" />
              <MethodItem title="Definition — Bot application" content="Bot application is identifying forced explanation." />
              <MethodItem title="Action step" content="Write one reveal-focused caption." />
              <MethodItem title="Definition — Action step" content="An action step is one enforced reveal choice." />
           </div>
        </div>

        <BuildInput
          label="Create one post that reveals instead of explains"
          description="Action Step: One enforced shift from explanation to discovery."
          value={form.discoveryDefinition}
          mode={navMode}
          onChange={(val) => setForm((prev: any) => ({ ...prev, discoveryDefinition: val }))}
          onBlur={() => validateSection('discovery')}
        />
      </section>

      {/* SECTION 3 — CONNECTION */}
      <section className="space-y-12 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black tracking-[3px] text-white/40 italic">SECTION 3 — CONNECTION</h3>
          {isBuildMode && sectionStatus.connection && (
            <span className={cn("text-[9px] font-black tracking-widest px-3 py-1", 
              sectionStatus.connection === 'PASS' ? "bg-ww-cyan/20 text-ww-cyan" : "bg-ww-pink-deep/20 text-ww-pink-deep")}>
              {sectionStatus.connection}
            </span>
          )}
        </div>

        <div className="p-8 bg-white/2 border border-white/10 space-y-6 max-w-4xl">
           <h4 className="text-xl font-black italic tracking-tighter">🩷 Connection</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <MethodItem title="What this controls" content="This controls system continuity." />
              <MethodItem title="Failure point" content="If posts reset every time, there is no system." />
              <MethodItem title="What to do" content="Link every post." />
              <MethodItem title="Definition — What to do" content="What to do is enforcing logical continuation." />
              <MethodItem title="Bot application" content="Use the bot to detect 'Resetting' logic." />
              <MethodItem title="Definition — Bot application" content="Bot application is identifying lack of connection." />
              <MethodItem title="Action step" content="Define three connection points." />
              <MethodItem title="Definition — Action step" content="An action step is one enforced connection choice." />
           </div>
        </div>

        <BuildInput
          label="Define how your content connects across posts"
          description="Must include ALL 3: continuation + reveal + direction. Describe logic (not vague statements)."
          value={form.connectionDefinition}
          mode={navMode}
          onChange={(val) => setForm((prev: any) => ({ ...prev, connectionDefinition: val }))}
          onBlur={() => validateSection('connection')}
        />
      </section>

      {/* FINAL LOCK */}
      <div className="pt-20 border-t border-white/10 text-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isReadyToLock || validating}
          className={cn(
            "initialize-btn w-full md:w-[400px] mx-auto flex items-center justify-center gap-3",
            (!isReadyToLock || validating) && "opacity-20 cursor-not-allowed shadow-none translate-y-1"
          )}
        >
          {validating ? <Loader2 className="w-5 h-5 animate-spin" /> : "[ LOCK NARRATIVE ]"}
        </button>
        <p className="enforcement-text mt-6 normal-case">
          {!isBuildMode ? "SYSTEM_LOCKED in REVIEW_MODE — Switch to BUILD_MODE to proceed." : 
          !isReadyToLock ? "ENFORCEMENT_PROTOCOL_ACTIVE // PENDING_PASS_REQS" : "NARRATIVE_SYNC_COMPLETE // READY_FOR_STRUCTURE"}
        </p>
      </div>
    </div>
  );
}

// --- PHASE 7: SYSTEM STRUCTURE COMPONENT ---

const P7_REQUIRED_SECTIONS = ['mirror', 'reveal', 'system'];

function Phase7SystemStructure({ data, onSave, isLocked, isDevMode, navMode }: { data: any, onSave: (data: any) => void, isLocked: boolean, isDevMode?: boolean, navMode: 'REVIEW' | 'BUILD' }) {
  const [form, setForm] = useState<any>({
    mirror: data.phase7?.mirror || '',
    reveal: data.phase7?.reveal || '',
    system: data.phase7?.system || '',
  });

  const [validating, setValidating] = useState(false);
  const [sectionValidating, setSectionValidating] = useState<string | null>(null);
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'PASS' | 'FAIL' | null>>({
    mirror: data.phase7?.mirror ? 'PASS' : null,
    reveal: data.phase7?.reveal ? 'PASS' : null,
    system: data.phase7?.system ? 'PASS' : null,
  });
  const [expandedSections, setExpandedSections] = useState<string[]>(['mirror']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isBuildMode = navMode === 'BUILD';

  const getLiveWarning = (id: string, val: string) => {
    if (!val || !isBuildMode) return null;
    const blockWords = ['vibe', 'energy', 'something', 'things'];
    if (blockWords.some(w => val.toLowerCase().includes(w))) return "Too abstract";
    
    if (id === 'mirror') {
       if (val.length < 15) return "Not grounded in experience";
    }
    
    if (id === 'reveal') {
       if (val.length > 5 && val.toLowerCase() === form.mirror.toLowerCase()) return "This repeats your first line";
       if (val.length > 5 && form.mirror.length > 5 && !val.split(' ').some(w => w.length > 3 && !form.mirror.toLowerCase().includes(w.toLowerCase()))) return "No shift detected";
    }
    
    if (id === 'system') {
       const ruleWords = ['rule', 'pattern', 'structure', 'because', 'system', 'logic', 'meaning', 'if', 'then', 'leads'];
       if (val.length > 0 && !ruleWords.some(w => val.toLowerCase().includes(w))) return "Define the rule behind this";
    }
    
    return null;
  };

  const validateSection = async (sectionId: string) => {
    if (!isBuildMode) return;
    if (isDevMode) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'PASS' }));
      return;
    }

    setSectionValidating(sectionId);
    setErrorMessage(null);
    let sectionData = "";
    let error = "";

    const blockWords = ['vibe', 'energy', 'something', 'things'];

    if (sectionId === 'mirror') {
      const val = form.mirror.trim();
      const sentences = val.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const hasBlockWords = blockWords.some(w => val.toLowerCase().includes(w));
      
      if (sentences.length < 1 || hasBlockWords || val.length < 10) {
        error = "No audience connection. Anchor this in a real experience.";
      }
      sectionData = val;
    }

    if (sectionId === 'reveal') {
      const val = form.reveal.trim();
      if (!val || val.toLowerCase() === form.mirror.toLowerCase() || val.length < 10) {
        error = "No shift detected. Add a new layer or insight.";
      }
      sectionData = val;
    }

    if (sectionId === 'system') {
      const val = form.system.trim();
      if (!val || blockWords.some(w => val.toLowerCase().includes(w)) || val.length < 10) {
        error = "No structure detected. Define the rule behind your insight.";
      }
      sectionData = val;
    }

    if (error) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
      setErrorMessage(error);
      setSectionValidating(null);
      return;
    }

    const prompt = `Phase 7 ${sectionId.toUpperCase()} Validation. Input: "${sectionData}". Rules: ${
      sectionId === 'mirror' ? 'Must reference a real experience/feeling. Block generic/abstract phrasing.' :
      sectionId === 'reveal' ? 'Must introduce NEW information or perspective. Must shift from the mirror.' :
      'Must explain the pattern/rule behind the insight. Build authority.'
    } Reject "vibe", "energy", "something", "things".`;

    const result = await analyzeSystemInput(prompt);
    setSectionStatus(prev => ({ ...prev, [sectionId]: result.passed ? 'PASS' : 'FAIL' }));
    if (!result.passed) setErrorMessage(result.reasons.join(' ') || "Validation failed.");
    setSectionValidating(null);
  };

  const StatusIcon = ({ id }: { id: string }) => {
    const status = sectionStatus[id];
    const isValidating = sectionValidating === id;
    
    if (isValidating) return <Loader2 className="w-4 h-4 text-ww-cyan animate-spin" />;
    if (status === 'PASS') return <CheckCircle2 className="w-4 h-4 text-ww-cyan" />;
    if (status === 'FAIL') return <XCircle className="w-4 h-4 text-ww-pink-deep" />;
    if (form[id].length > 0) return <div className="h-4 w-4 rounded-full border-2 border-yellow-500 bg-yellow-500/20" />;
    return <Circle className="w-4 h-4 text-white/10" />;
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Final sequence check
    const mirror = form.mirror.trim();
    const reveal = form.reveal.trim();
    const system = form.system.trim();
    
    if (isBuildMode && (!mirror || !reveal || !system)) {
        setErrorMessage("Your structure is broken. Mirror → Reveal → System must connect.");
        return;
    }

    const allPassed = P7_REQUIRED_SECTIONS.every(s => sectionStatus[s] === 'PASS');
    if (isDevMode || (isBuildMode && allPassed)) {
      setValidating(true);
      await onSave({ phase7: form });
      setValidating(false);
    }
  };

  const toggleSection = (id: string, isInternalLocked?: boolean) => {
    if (isInternalLocked && isBuildMode) return;
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const isReadyToLock = isDevMode || (isBuildMode && P7_REQUIRED_SECTIONS.every(s => sectionStatus[s] === 'PASS'));

  return (
    <div className="space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700 uppercase">
       {/* HEADER */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase font-black tracking-[4px] text-ww-cyan">PHASE 7 PROTOCOL</span>
        <h2 className="text-6xl font-black tracking-tighter leading-none italic uppercase">SYSTEM STRUCTURE</h2>
        <p className="text-white/60 font-medium normal-case">Define how your content connects, moves, and builds meaning.</p>
      </div>

      <div className="space-y-6">
        {/* SECTION 1 — MIRROR */}
        <div className={cn("border transition-all", sectionStatus.mirror === 'PASS' ? "border-ww-cyan/30" : "border-white/5")}>
          <button
            type="button"
            onClick={() => toggleSection('mirror')}
            className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <h4 className="text-sm font-black italic tracking-tighter uppercase">Mirror</h4>
              <StatusIcon id="mirror" />
            </div>
            {expandedSections.includes('mirror') ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>

          <AnimatePresence>
            {expandedSections.includes('mirror') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-8 space-y-8 bg-ww-charcoal/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-sm text-white/70 font-medium normal-case leading-relaxed">
                        Reflects something the audience recognizes.
                      </p>
                      <MethodItem title="What this controls" content="This controls immediate connection." />
                      <MethodItem title="How to apply it" content="Begin with something the audience already feels, knows, or experiences." />
                      <MethodItem title="Failure point" content="Without mirror, people don’t see themselves in the content." />
                    </div>
                    <div className="space-y-4">
                      <MethodItem title="What to do" content="Start with something familiar to the audience." />
                      <MethodItem title="Definition — What to do" content="What to do is anchoring content in recognizable experience." />
                      <MethodItem title="Bot application" content="Use the bot to detect lack of relatability." />
                      <MethodItem title="Definition — Bot application" content="Bot application is identifying missing connection and forcing relatability." />
                      <MethodItem title="Action step" content="Write one line your audience instantly recognizes." />
                      <MethodItem title="Definition — Action step" content="An action step is one enforced connection point." />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 bg-ww-cyan/10 border border-ww-cyan/20 text-[9px] font-black tracking-widest text-ww-cyan uppercase">
                      "Start with something your audience has already felt, experienced, or thought."
                    </div>
                    <BuildInput
                      label="Write your Mirror line"
                      description="Minimum 1 sentence. Must reference a real experience, feeling, or situation. BLOCK vague phrasing."
                      value={form.mirror}
                      mode={navMode}
                      onChange={(val) => {
                        setForm((prev: any) => ({ ...prev, mirror: val }));
                        if (sectionStatus.mirror) setSectionStatus(prev => ({ ...prev, mirror: null }));
                      }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-[10px] font-bold text-ww-pink-deep h-4">
                        {getLiveWarning('mirror', form.mirror)}
                      </div>
                      <button
                        type="button"
                        onClick={() => validateSection('mirror')}
                        disabled={sectionValidating === 'mirror' || !form.mirror}
                        className="px-4 py-2 bg-ww-cyan/10 border border-ww-cyan/30 text-[9px] font-black tracking-widest text-ww-cyan hover:bg-ww-cyan/20 transition-all disabled:opacity-30"
                      >
                        {sectionValidating === 'mirror' ? 'CHECKING...' : '[ CHECK SECTION ]'}
                      </button>
                    </div>
                    {sectionStatus.mirror === 'PASS' && (
                      <p className="text-[10px] font-black tracking-widest text-ww-cyan mt-2">Structure holds. You’ve created connection.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SECTION 2 — REVEAL */}
        <div className={cn("border transition-all", 
          sectionStatus.reveal === 'PASS' ? "border-ww-cyan/30" : "border-white/5",
          sectionStatus.mirror !== 'PASS' && isBuildMode && "opacity-50 pointer-events-none"
        )}>
          <button
            type="button"
            onClick={() => toggleSection('reveal')}
            className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <h4 className="text-sm font-black italic tracking-tighter uppercase">Reveal</h4>
              <StatusIcon id="reveal" />
              {sectionStatus.mirror !== 'PASS' && isBuildMode && (
                <span className="text-[8px] font-black tracking-widest text-white/30 italic ml-2">Complete previous step first.</span>
              )}
            </div>
            {expandedSections.includes('reveal') ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>

          <AnimatePresence>
            {expandedSections.includes('reveal') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-8 space-y-8 bg-ww-charcoal/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-sm text-white/70 font-medium normal-case leading-relaxed">
                        Shows something new.
                      </p>
                      <MethodItem title="What this controls" content="This controls curiosity and movement." />
                      <MethodItem title="How to apply it" content="Expose a shift, hidden layer, or realization." />
                      <MethodItem title="Failure point" content="Without reveal, the content feels flat." />
                    </div>
                    <div className="space-y-4">
                      <MethodItem title="What to do" content="Introduce a new perspective or shift." />
                      <MethodItem title="Definition — What to do" content="What to do is creating movement through insight." />
                      <MethodItem title="Bot application" content="Use the bot to detect flat or predictable content." />
                      <MethodItem title="Definition — Bot application" content="Bot application is identifying lack of depth and forcing change." />
                      <MethodItem title="Action step" content="Add one unexpected insight." />
                      <MethodItem title="Definition — Action step" content="An action step is one enforced shift that creates intrigue." />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 bg-ww-cyan/10 border border-ww-cyan/20 text-[9px] font-black tracking-widest text-ww-cyan uppercase">
                      "Now shift it. What are they not seeing yet?"
                    </div>
                    <BuildInput
                      label="Write your Reveal shift"
                      description="Must introduce NEW information or perspective. Must NOT repeat mirror. Must show contrast or change."
                      value={form.reveal}
                      mode={navMode}
                      onChange={(val) => {
                        setForm((prev: any) => ({ ...prev, reveal: val }));
                        if (sectionStatus.reveal) setSectionStatus(prev => ({ ...prev, reveal: null }));
                      }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-[10px] font-bold text-ww-pink-deep h-4">
                        {getLiveWarning('reveal', form.reveal)}
                      </div>
                      <button
                        type="button"
                        onClick={() => validateSection('reveal')}
                        disabled={sectionValidating === 'reveal' || !form.reveal}
                        className="px-4 py-2 bg-ww-cyan/10 border border-ww-cyan/30 text-[9px] font-black tracking-widest text-ww-cyan hover:bg-ww-cyan/20 transition-all disabled:opacity-30"
                      >
                        {sectionValidating === 'reveal' ? 'CHECKING...' : '[ CHECK SECTION ]'}
                      </button>
                    </div>
                    {sectionStatus.reveal === 'PASS' && (
                      <p className="text-[10px] font-black tracking-widest text-ww-cyan mt-2">Structure holds. You’ve created movement.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SECTION 3 — SYSTEM */}
        <div className={cn("border transition-all", 
          sectionStatus.system === 'PASS' ? "border-ww-cyan/30" : "border-white/5",
          sectionStatus.reveal !== 'PASS' && isBuildMode && "opacity-50 pointer-events-none"
        )}>
          <button
            type="button"
            onClick={() => toggleSection('system')}
            className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <h4 className="text-sm font-black italic tracking-tighter uppercase">🔥 System</h4>
              <StatusIcon id="system" />
              {sectionStatus.reveal !== 'PASS' && isBuildMode && (
                <span className="text-[8px] font-black tracking-widest text-white/30 italic ml-2">Complete previous step first.</span>
              )}
            </div>
            {expandedSections.includes('system') ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>

          <AnimatePresence>
            {expandedSections.includes('system') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-8 space-y-8 bg-ww-charcoal/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-sm text-white/70 font-medium normal-case leading-relaxed">
                        Explains meaning or pattern.
                      </p>
                      <MethodItem title="What this controls" content="This controls authority and understanding." />
                      <MethodItem title="How to apply it" content="Anchor what was revealed into a structure or idea." />
                      <MethodItem title="Failure point" content="Without system, the content feels interesting but empty." />
                    </div>
                    <div className="space-y-4">
                      <MethodItem title="What to do" content="Explain the pattern behind the insight." />
                      <MethodItem title="Definition — What to do" content="What to do is turning insight into structure." />
                      <MethodItem title="Bot application" content="Use the bot to detect missing explanation." />
                      <MethodItem title="Definition — Bot application" content="Bot application is identifying lack of structure and forcing clarity." />
                      <MethodItem title="Action step" content="State one pattern or rule behind your content." />
                      <MethodItem title="Definition — Action step" content="An action step is one enforced explanation that builds authority." />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 bg-ww-cyan/10 border border-ww-cyan/20 text-[9px] font-black tracking-widest text-ww-cyan uppercase">
                      "Now explain it. What is the pattern behind that shift?"
                    </div>
                    <BuildInput
                      label="Define the system behind your insight"
                      description="Must include a pattern, rule, or explanation. Must connect to reveal."
                      value={form.system}
                      mode={navMode}
                      onChange={(val) => {
                        setForm((prev: any) => ({ ...prev, system: val }));
                        if (sectionStatus.system) setSectionStatus(prev => ({ ...prev, system: null }));
                      }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-[10px] font-bold text-ww-pink-deep h-4">
                        {getLiveWarning('system', form.system)}
                      </div>
                      <button
                        type="button"
                        onClick={() => validateSection('system')}
                        disabled={sectionValidating === 'system' || !form.system}
                        className="px-4 py-2 bg-ww-cyan/10 border border-ww-cyan/30 text-[9px] font-black tracking-widest text-ww-cyan hover:bg-ww-cyan/20 transition-all disabled:opacity-30"
                      >
                        {sectionValidating === 'system' ? 'CHECKING...' : '[ CHECK SECTION ]'}
                      </button>
                    </div>
                    {sectionStatus.system === 'PASS' && (
                      <p className="text-[10px] font-black tracking-widest text-ww-cyan mt-2">Structure holds. You’ve created meaning.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-ww-pink-deep/10 border border-ww-pink-deep/20 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-ww-pink-deep shrink-0 mt-0.5" />
          <p className="text-xs font-black tracking-widest text-ww-pink-deep uppercase">{errorMessage}</p>
        </div>
      )}

      {/* FINAL LOCK */}
      <div className="pt-20 border-t border-white/10 text-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isReadyToLock || validating}
          className={cn(
            "initialize-btn w-full md:w-[400px] mx-auto flex items-center justify-center gap-3",
            (!isReadyToLock || validating) && "opacity-20 cursor-not-allowed shadow-none translate-y-1"
          )}
        >
          {validating ? <Loader2 className="w-5 h-5 animate-spin" /> : "[ LOCK SYSTEM STRUCTURE ]"}
        </button>
        <p className="enforcement-text mt-6 normal-case">
          {!isBuildMode ? "SYSTEM_LOCKED in REVIEW_MODE — Switch to BUILD_MODE to proceed." : 
          !isReadyToLock ? "ENFORCEMENT_PROTOCOL_ACTIVE // PENDING_PASS_REQS" : "STRUCTURE_SYNC_COMPLETE // READY_FOR_CREATION_LOOP"}
        </p>
      </div>
    </div>
  );
}

// --- PHASE 8: CREATION LOOP COMPONENT ---

function Phase8CreationLoop({ data, onSave, isLocked, isDevMode, navMode }: { data: any, onSave: (data: any) => void, isLocked: boolean, isDevMode?: boolean, navMode: 'REVIEW' | 'BUILD' }) {
  const [form, setForm] = useState<any>({
    loopCount: data.phase8?.loopCount || 0,
    define: data.phase8?.define || '',
    create: data.phase8?.create || '',
    test: data.phase8?.test || {
      matchesIdentity: false,
      matchesWorld: false,
      matchesVisualLanguage: false,
      matchesTone: false,
      matchesStructure: false
    },
    refine: data.phase8?.refine || ''
  });

  const [validating, setValidating] = useState<string | null>(null);
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'PASS' | 'FAIL' | null>>({
     define: data.phase8?.define ? 'PASS' : null,
     create: data.phase8?.create ? 'PASS' : null,
     test: (data.phase8?.test && Object.values(data.phase8.test).every(v => v)) ? 'PASS' : null,
     refine: data.phase8?.refine ? 'PASS' : null
  });
  const [expandedSections, setExpandedSections] = useState<string[]>(['define']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isBuildMode = navMode === 'BUILD';

  const getLiveWarning = (id: string, val: string) => {
    if (!val || !isBuildMode) return null;
    const blockWords = ['something', 'stuff', 'content', 'vibe', 'random'];
    
    if (id === 'define') {
      if (blockWords.some(w => val.toLowerCase().includes(w))) return "Too broad";
      if (val.length < 10) return "No clear direction";
    }
    
    if (id === 'create') {
      // Basic check for off-system behavior logic
      const systemKeywords = ['identity', 'world', 'visual', 'tone', 'structure', 'mirror', 'reveal', 'system'];
      if (!systemKeywords.some(w => val.toLowerCase().includes(w))) return "Not aligned with system";
    }

    return null;
  };

  const validateSection = async (sectionId: string) => {
    if (!isBuildMode) return;
    if (isDevMode) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'PASS' }));
      return;
    }

    setValidating(sectionId);
    setErrorMessage(null);
    let sectionData = "";
    let error = "";

    if (sectionId === 'define') {
      const val = form.define.trim();
      const blockWords = ['something', 'stuff', 'content'];
      if (!val || blockWords.some(w => val.toLowerCase().includes(w))) {
        error = "Direction unclear. Define what you are building.";
      }
      sectionData = val;
    }

    if (sectionId === 'create') {
      const val = form.create.trim();
      if (!val || val.length < 10) {
        error = "Creation outside system.";
      }
      sectionData = val;
    }

    if (sectionId === 'test') {
      const allChecked = Object.values(form.test).every(v => v);
      if (!allChecked) {
        error = "System check skipped.";
      }
    }

    if (sectionId === 'refine') {
      const val = form.refine.trim();
      if (!val) {
        error = "Refinement missing.";
      }
      sectionData = val;
    }

    if (error) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'FAIL' }));
      setErrorMessage(error);
      setValidating(null);
      return;
    }

    if (sectionId === 'define' || sectionId === 'create' || sectionId === 'refine') {
      const prompt = `Phase 8 ${sectionId.toUpperCase()} Validation. Input: "${sectionData}". Rules: ${
        sectionId === 'define' ? 'Must be clear and specific direction. No generic content words.' :
        sectionId === 'create' ? 'Must reference system elements (identity, world, etc).' :
        'Must describe a removal or improvement.'
      }`;
      const result = await analyzeSystemInput(prompt);
      const passed = result.passed;
      setSectionStatus(prev => {
        const next = { ...prev, [sectionId]: passed ? 'PASS' : 'FAIL' };
        // Check if this was the last section needed for loopPass
        const isLoopComplete = P8_SECTIONS.every(s => s === sectionId ? passed : prev[s] === 'PASS');
        if (isLoopComplete && isBuildMode) {
           onSave({ phase8: { ...form, [sectionId]: sectionData } });
        }
        return next;
      });
      if (!result.passed) setErrorMessage(result.reasons.join(' ') || "Validation failed.");
    } else if (sectionId === 'test') {
       // For test checklist, it doesn't use AI but we still check loop completion
       setSectionStatus(prev => {
          const next = { ...prev, test: 'PASS' };
          const isLoopComplete = P8_SECTIONS.every(s => s === 'test' ? true : prev[s] === 'PASS');
          if (isLoopComplete && isBuildMode) {
             onSave({ phase8: form });
          }
          return next;
       });
    }
    
    setValidating(null);
  };

  const resetLoop = async () => {
     const newCount = form.loopCount + 1;
     const resetForm = {
       loopCount: newCount,
       define: '',
       create: '',
       test: {
         matchesIdentity: false,
         matchesWorld: false,
         matchesVisualLanguage: false,
         matchesTone: false,
         matchesStructure: false
       },
       refine: ''
     };
     setForm(resetForm);
     setSectionStatus({
       define: null,
       create: null,
       test: null,
       refine: null
     });
     setExpandedSections(['define']);
     // If first loop completed, we can advance currentPhase in DB but Phase 8 stays active as it's a loop
     // The requirement says "After 1 full loop PASS -> Unlock Phase 9"
     // We trigger onSave which will advance currentPhase if it matches
     await onSave({ phase8: resetForm });
  };

  const toggleSection = (id: string, isInternalLocked: boolean) => {
    if (isInternalLocked && isBuildMode) return;
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const P8_SECTIONS = ['define', 'create', 'test', 'refine'];
  const loopPass = P8_SECTIONS.every(s => sectionStatus[s] === 'PASS');

  const StatusIcon = ({ id }: { id: string }) => {
    const status = sectionStatus[id];
    const iconValidating = validating === id;
    if (iconValidating) return <Loader2 className="w-4 h-4 text-ww-cyan animate-spin" />;
    if (status === 'PASS') return <CheckCircle2 className="w-4 h-4 text-ww-cyan" />;
    if (status === 'FAIL') return <XCircle className="w-4 h-4 text-ww-pink-deep" />;
    if (id !== 'test' && form[id].length > 0) return <div className="h-4 w-4 rounded-full border-2 border-yellow-500 bg-yellow-500/20" />;
    return <Circle className="w-4 h-4 text-white/10" />;
  };

  return (
    <div className="space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700 uppercase">
       {/* HEADER */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase font-black tracking-[4px] text-ww-cyan">PHASE 8 PROTOCOL</span>
        <h2 className="text-6xl font-black tracking-tighter leading-none italic uppercase">CREATION LOOP</h2>
        <p className="text-white/60 font-medium normal-case">Build, test, and refine your system through repetition.</p>
      </div>

      {/* LOOP VISUAL */}
      <div className="py-12 border-y border-white/5">
         <div className="flex flex-col items-center gap-8">
            <div className="flex items-center justify-between w-full max-w-2xl text-[10px] font-black tracking-widest text-white/40 italic">
               <div className={cn("flex flex-col items-center gap-2", sectionStatus.define === 'PASS' && "text-ww-cyan")}>
                  <span>[ DEFINE ]</span>
                  {sectionStatus.define === 'PASS' && <CheckCircle2 className="w-4 h-4" />}
               </div>
               <div className="h-px bg-white/10 flex-1 mx-4" />
               <div className={cn("flex flex-col items-center gap-2", sectionStatus.create === 'PASS' && "text-ww-cyan")}>
                  <span>[ CREATE ]</span>
                  {sectionStatus.create === 'PASS' && <CheckCircle2 className="w-4 h-4" />}
               </div>
               <div className="h-px bg-white/10 flex-1 mx-4" />
               <div className={cn("flex flex-col items-center gap-2", sectionStatus.test === 'PASS' && "text-ww-cyan")}>
                  <span>[ TEST ]</span>
                  {sectionStatus.test === 'PASS' && <CheckCircle2 className="w-4 h-4" />}
               </div>
               <div className="h-px bg-white/10 flex-1 mx-4" />
               <div className={cn("flex flex-col items-center gap-2", sectionStatus.refine === 'PASS' && "text-ww-cyan")}>
                  <span>[ REFINE ]</span>
                  {sectionStatus.refine === 'PASS' && <CheckCircle2 className="w-4 h-4" />}
               </div>
            </div>
            <svg className="w-full max-w-2xl h-8 -mt-2 opacity-10 text-ww-cyan" viewBox="0 0 400 40">
               <path d="M 370 0 Q 370 30 200 30 Q 30 30 30 0" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
            <p className="text-[9px] font-black tracking-[3px] text-ww-pink-rose uppercase">"This loop does not end. It improves."</p>
         </div>
      </div>

      {/* PROGRESS TRACKING */}
      <div className="flex justify-center">
         <div className="px-6 py-3 bg-white/2 border border-white/10 flex items-center gap-4">
            <span className="text-[10px] font-black tracking-widest text-white/40">LOOP RUNS COMPLETED:</span>
            <span className="text-xl font-black italic text-ww-cyan">{form.loopCount}</span>
         </div>
      </div>

      {/* SECTIONS */}
      <div className="space-y-6">
         {/* DEFINE */}
         <div className={cn("border transition-all", sectionStatus.define === 'PASS' ? "border-ww-cyan/30" : "border-white/5")}>
            <button
               type="button"
               onClick={() => toggleSection('define', false)}
               className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors"
            >
               <div className="flex items-center gap-4">
                  <h4 className="text-sm font-black italic tracking-tighter uppercase">🪞 Define</h4>
                  <StatusIcon id="define" />
               </div>
               {expandedSections.includes('define') ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
            </button>
            <AnimatePresence>
               {expandedSections.includes('define') && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-ww-charcoal/40">
                     <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <MethodItem title="Set direction" content="Clarity before action." />
                              <MethodItem title="What this controls" content="Clarity before action." />
                              <MethodItem title="How to apply it" content="Know what you are building before creating." />
                              <MethodItem title="Failure point" content="Without definition, output becomes random." />
                           </div>
                           <div className="space-y-4">
                              <MethodItem title="What to do" content="Define direction before creating." />
                              <MethodItem title="Definition — What to do" content="Establishing clarity before execution." />
                              <MethodItem title="Bot application" content="Use the bot to detect when this step is weak, skipped, or misaligned." />
                              <MethodItem title="Definition — Bot application" content="Bot application is identifying breakdown in the creation loop and forcing correction before moving forward." />
                              <MethodItem title="Action step" content="Write one clear intention before creating." />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <BuildInput
                              label="Define your intention"
                              description="Must be clear and specific. Reference what is being created. BLOCK vague words."
                              value={form.define}
                              mode={navMode}
                              onChange={(val) => {
                                 setForm((prev: any) => ({ ...prev, define: val }));
                                 if (sectionStatus.define) setSectionStatus(prev => ({ ...prev, define: null }));
                              }}
                           />
                           <div className="flex items-center justify-between">
                              <div className="text-[10px] font-bold text-ww-pink-deep">{getLiveWarning('define', form.define)}</div>
                              <button type="button" onClick={() => validateSection('define')} className="px-6 py-2 bg-ww-cyan/10 border border-ww-cyan/20 text-[9px] font-black tracking-widest text-ww-cyan hover:bg-ww-cyan/20">
                                 {validating === 'define' ? "CHECKING..." : "[ CHECK DEFINE ]"}
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* CREATE */}
         <div className={cn("border transition-all", 
            sectionStatus.create === 'PASS' ? "border-ww-cyan/30" : "border-white/5",
            sectionStatus.define !== 'PASS' && isBuildMode && "opacity-50 pointer-events-none"
         )}>
            <button
               type="button"
               disabled={sectionStatus.define !== 'PASS' && isBuildMode}
               onClick={() => toggleSection('create', sectionStatus.define !== 'PASS')}
               className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors"
            >
               <div className="flex items-center gap-4">
                  <h4 className="text-sm font-black italic tracking-tighter uppercase">🔥 Create</h4>
                  <StatusIcon id="create" />
                  {sectionStatus.define !== 'PASS' && isBuildMode && <span className="text-[8px] font-black tracking-widest text-white/20 italic">Follow sequence</span>}
               </div>
               {expandedSections.includes('create') ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
            </button>
            <AnimatePresence>
               {expandedSections.includes('create') && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-ww-charcoal/40">
                     <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <MethodItem title="Execute visuals" content="Output control." />
                              <MethodItem title="What this controls" content="Execution control." />
                              <MethodItem title="How to apply it" content="Create within the system rules." />
                              <MethodItem title="Failure point" content="Consistency breaks if creation ignores system." />
                           </div>
                           <div className="space-y-4">
                              <MethodItem title="What to do" content="Create based on system rules." />
                              <MethodItem title="Definition — What to do" content="Executing within structure." />
                              <MethodItem title="Bot application" content="Use the bot to detect when this step is weak, skipped, or misaligned." />
                              <MethodItem title="Definition — Bot application" content="Bot application is identifying breakdown in the creation loop and forcing correction before moving forward." />
                              <MethodItem title="Action step" content="Create one piece using your rules." />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <BuildInput
                              label="Describe what you created"
                              description="Must reference system elements (identity, world, tone, etc). No generic statements."
                              value={form.create}
                              mode={navMode}
                              onChange={(val) => {
                                 setForm((prev: any) => ({ ...prev, create: val }));
                                 if (sectionStatus.create) setSectionStatus(prev => ({ ...prev, create: null }));
                              }}
                           />
                           <div className="flex items-center justify-between">
                              <div className="text-[10px] font-bold text-ww-pink-deep">{getLiveWarning('create', form.create)}</div>
                              <button type="button" onClick={() => validateSection('create')} className="px-6 py-2 bg-ww-cyan/10 border border-ww-cyan/20 text-[9px] font-black tracking-widest text-ww-cyan hover:bg-ww-cyan/20">
                                 {validating === 'create' ? "CHECKING..." : "[ CHECK CREATE ]"}
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* TEST */}
         <div className={cn("border transition-all", 
            sectionStatus.test === 'PASS' ? "border-ww-cyan/30" : "border-white/5",
            sectionStatus.create !== 'PASS' && isBuildMode && "opacity-50 pointer-events-none"
         )}>
            <button
               type="button"
               disabled={sectionStatus.create !== 'PASS' && isBuildMode}
               onClick={() => toggleSection('test', sectionStatus.create !== 'PASS')}
               className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors"
            >
               <div className="flex items-center gap-4">
                  <h4 className="text-sm font-black italic tracking-tighter uppercase">❤️‍🔥 Test</h4>
                  <StatusIcon id="test" />
               </div>
               {expandedSections.includes('test') ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
            </button>
            <AnimatePresence>
               {expandedSections.includes('test') && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-ww-charcoal/40">
                     <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <MethodItem title="Check alignment" content="Review content against the system." />
                              <MethodItem title="What this controls" content="Alignment control." />
                              <MethodItem title="How to apply it" content="Review if content matches Identity, World, Visuals, Tone, Structure." />
                              <MethodItem title="Failure point" content="Without testing, weak content survives." />
                           </div>
                           <div className="space-y-4">
                              <MethodItem title="What to do" content="Check alignment before posting." />
                              <MethodItem title="Definition — What to do" content="Validating before publishing." />
                              <MethodItem title="Bot application" content="Use the bot to detect when this step is weak, skipped, or misaligned." />
                              <MethodItem title="Definition — Bot application" content="Bot application is identifying breakdown in the creation loop and forcing correction before moving forward." />
                              <MethodItem title="Action step" content="Run content through system checklist." />
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                { id: 'matchesIdentity', label: 'Matches Identity' },
                                { id: 'matchesWorld', label: 'Matches World' },
                                { id: 'matchesVisualLanguage', label: 'Matches Visual Language' },
                                { id: 'matchesTone', label: 'Matches Tone' },
                                { id: 'matchesStructure', label: 'Matches Structure' }
                              ].map(toggle => (
                                 <button
                                    key={toggle.id}
                                    type="button"
                                    onClick={() => {
                                       setForm((prev: any) => ({ ...prev, test: { ...prev.test, [toggle.id]: !prev.test[toggle.id] } }));
                                       setSectionStatus(prev => ({ ...prev, test: null }));
                                    }}
                                    className={cn(
                                       "p-4 text-left border flex items-center justify-between group transition-all",
                                       form.test[toggle.id] ? "bg-ww-cyan/5 border-ww-cyan/40 text-ww-cyan" : "bg-white/2 border-white/5 text-white/40 hover:border-white/20"
                                    )}
                                 >
                                    <span className="text-[10px] font-black tracking-widest">{toggle.label.toUpperCase()}</span>
                                    <div className={cn("h-4 w-4 rounded-sm border flex items-center justify-center transition-all", form.test[toggle.id] ? "bg-ww-cyan border-ww-cyan" : "border-white/20")}>
                                       {form.test[toggle.id] && <CheckCircle2 className="w-3 h-3 text-ww-charcoal" />}
                                    </div>
                                 </button>
                              ))}
                           </div>
                           <div className="flex justify-end">
                              <button type="button" onClick={() => validateSection('test')} className="px-6 py-2 bg-ww-cyan/10 border border-ww-cyan/20 text-[9px] font-black tracking-widest text-ww-cyan hover:bg-ww-cyan/20">
                                 [ CHECK TEST ]
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* REFINE */}
         <div className={cn("border transition-all", 
            sectionStatus.refine === 'PASS' ? "border-ww-cyan/30" : "border-white/5",
            sectionStatus.test !== 'PASS' && isBuildMode && "opacity-50 pointer-events-none"
         )}>
            <button
               type="button"
               disabled={sectionStatus.test !== 'PASS' && isBuildMode}
               onClick={() => toggleSection('refine', sectionStatus.test !== 'PASS')}
               className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors"
            >
               <div className="flex items-center gap-4">
                  <h4 className="text-sm font-black italic tracking-tighter uppercase">🩷 Refine</h4>
                  <StatusIcon id="refine" />
               </div>
               {expandedSections.includes('refine') ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
            </button>
            <AnimatePresence>
               {expandedSections.includes('refine') && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-ww-charcoal/40">
                     <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <MethodItem title="Improve parts" content="Quality and growth control." />
                              <MethodItem title="What this controls" content="Growth control." />
                              <MethodItem title="How to apply it" content="Edit and remove anything that weakens the system." />
                              <MethodItem title="Failure point" content="If refinement is skipped, the system never sharpens." />
                           </div>
                           <div className="space-y-4">
                              <MethodItem title="What to do" content="Edit and remove weak elements." />
                              <MethodItem title="Definition — What to do" content="Improving through removal and adjustment." />
                              <MethodItem title="Bot application" content="Use the bot to detect when this step is weak, skipped, or misaligned." />
                              <MethodItem title="Definition — Bot application" content="Bot application is identifying breakdown in the creation loop and forcing correction before moving forward." />
                              <MethodItem title="Action step" content="Remove one weak part before posting." />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <BuildInput
                              label="What did you refine?"
                              description="Must describe a removal or improvement. No empty inputs."
                              value={form.refine}
                              mode={navMode}
                              onChange={(val) => {
                                 setForm((prev: any) => ({ ...prev, refine: val }));
                                 if (sectionStatus.refine) setSectionStatus(prev => ({ ...prev, refine: null }));
                              }}
                           />
                           <div className="flex justify-end">
                              <button type="button" onClick={() => validateSection('refine')} className="px-6 py-2 bg-ww-cyan/10 border border-ww-cyan/20 text-[9px] font-black tracking-widest text-ww-cyan hover:bg-ww-cyan/20">
                                 {validating === 'refine' ? "CHECKING..." : "[ CHECK REFINE ]"}
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>

       {errorMessage && (
        <div className="p-4 bg-ww-pink-deep/10 border border-ww-pink-deep/20 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-ww-pink-deep shrink-0 mt-0.5" />
          <p className="text-xs font-black tracking-widest text-ww-pink-deep uppercase">{errorMessage}</p>
        </div>
      )}

      {/* FINAL LOCK / RESET */}
      <div className="pt-20 border-t border-white/10 text-center space-y-8">
         {loopPass ? (
            <div className="space-y-8">
               <div className="p-8 bg-ww-cyan/5 border border-ww-cyan/20 animate-in zoom-in duration-500">
                  <span className="text-[10px] font-black tracking-[4px] text-ww-cyan uppercase">LOOP_SYNC_COMPLETE</span>
                  <p className="enforcement-text mt-4">One full creation loop has been completed and verified.</p>
               </div>
               <button
                  type="button"
                  onClick={resetLoop}
                  className="initialize-btn w-full md:w-[400px] mx-auto flex items-center justify-center gap-3"
               >
                  [ RUN LOOP AGAIN ]
               </button>
            </div>
         ) : (
            <div className="p-12 border border-white/5 bg-white/2">
               <p className="enforcement-text normal-case">
                  {!isBuildMode ? "LOOP_LOCKED in REVIEW_MODE — Switch to BUILD_MODE to proceed." : 
                  "ENFORCEMENT_PROTOCOL_ACTIVE // COMPLETE_ALL_LOOP_STEPS"}
               </p>
            </div>
         )}
      </div>
    </div>
  );
}

// --- PHASE 9: CONVERSION SYSTEM COMPONENT ---

function Phase9ConversionSystem({ data, onSave, isLocked, isDevMode, navMode }: { data: any, onSave: (data: any) => void, isLocked: boolean, isDevMode?: boolean, navMode: 'REVIEW' | 'BUILD' }) {
  const [form, setForm] = useState<Phase9Data>({
    messaging: data.phase9?.messaging || '',
    conversion: data.phase9?.conversion || '',
    structure: data.phase9?.structure || '',
    movement: data.phase9?.movement || '',
    dmFlow: {
      diagnose: data.phase9?.dmFlow?.diagnose || '',
      segment: data.phase9?.dmFlow?.segment || '',
      reframe: data.phase9?.dmFlow?.reframe || '',
      offer: data.phase9?.dmFlow?.offer || '',
      close: data.phase9?.dmFlow?.close || '',
    }
  });

  const [expandedSections, setExpandedSections] = useState<string[]>(['messaging']);
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'PASS' | 'FAIL' | null>>({
    messaging: data.phase9?.messaging ? 'PASS' : null,
    conversion: data.phase9?.conversion ? 'PASS' : null,
    structure: data.phase9?.structure ? 'PASS' : null,
    movement: data.phase9?.movement ? 'PASS' : null,
    dmFlow: (data.phase9?.dmFlow?.close) ? 'PASS' : null
  });

  const [validating, setValidating] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isBuildMode = navMode === 'BUILD';

  const validateSection = async (sectionId: string) => {
    if (!isBuildMode) return;
    if (isDevMode) {
      setSectionStatus(prev => ({ ...prev, [sectionId]: 'PASS' }));
      return;
    }

    setValidating(sectionId);
    setErrorMessage(null);
    let result = { passed: false, reasons: ["Unknown error"] };

    try {
      if (sectionId === 'messaging') {
        const val = form.messaging.trim();
        const blockWords = ['value', 'things', 'stuff'];
        if (!val || blockWords.some(w => val.toLowerCase().includes(w))) {
           result = { passed: false, reasons: ["Message unclear. Avoid vague words like 'value' or 'stuff'."] };
        } else {
           result = await analyzeSystemInput(`Phase 9 Messaging Validation. Input: "${val}". Rules: Must be clear and understandable without context. Detected vague words were partially blocked already but ensure deep clarity.`);
        }
      } else if (sectionId === 'conversion') {
        const val = form.conversion.trim();
        const actions = ['reply', 'click', 'dm', 'buy', 'sign', 'comment', 'message'];
        if (!val || !actions.some(a => val.toLowerCase().includes(a))) {
          result = { passed: false, reasons: ["No clear action. Must include a clear direction (reply, click, DM, etc)."] };
        } else {
          result = { passed: true, reasons: [] };
        }
      } else if (sectionId === 'structure') {
        const val = form.structure.trim();
        if (!val || val.length < 10) {
          result = { passed: false, reasons: ["No clear flow. Steps must be repeatable."] };
        } else {
          result = { passed: true, reasons: [] };
        }
      } else if (sectionId === 'movement') {
        if (!form.movement) {
          result = { passed: false, reasons: ["No movement stage selected."] };
        } else {
          result = { passed: true, reasons: [] };
        }
      } else if (sectionId === 'dmFlow') {
        const { diagnose, segment, reframe, offer, close } = form.dmFlow;
        if (!diagnose || !segment || !reframe || !offer || !close) {
          result = { passed: false, reasons: ["DM flow incomplete."] };
        } else {
          const prompt = `Phase 9 DM Flow Validation. 
          Step 1 Diagnose: ${diagnose} (Must go deeper than surface).
          Step 2 Segment: ${segment} (Must classify person e.g. Artist, Entrepreneur, etc).
          Step 3 Reframe: ${reframe} (Must introduce new perspective/shift).
          Step 4 Offer: ${offer} (Must connect directly to the diagnosed problem).
          Step 5 Close: ${close} (Must be direct and require a response).`;
          result = await analyzeSystemInput(prompt);
        }
      }

      setSectionStatus(prev => ({ ...prev, [sectionId]: result.passed ? 'PASS' : 'FAIL' }));
      if (!result.passed) setErrorMessage(result.reasons[0]);
    } catch (e) {
      setErrorMessage("System validation error.");
    } finally {
      setValidating(null);
    }
  };

  const isAllPassed = Object.values(sectionStatus).every(s => s === 'PASS');

  const handleLock = () => {
    if (isAllPassed) {
       onSave({ phase9: form, currentPhase: 12 });
    }
  };

  const getLiveWarning = (id: string, val: string) => {
    if (!val || !isBuildMode) return null;
    if (id === 'messaging') {
      const blockWords = ['value', 'things', 'stuff'];
      if (blockWords.some(w => val.toLowerCase().includes(w))) return "Too broad; avoid vague words";
      if (val.length < 10) return "No clear message detected";
    }
    return null;
  };

  const StatusIconLocal = ({ status, validating }: { status: 'PASS' | 'FAIL' | null, validating?: boolean }) => {
    if (validating) return <Loader2 className="w-4 h-4 text-ww-cyan animate-spin" />;
    if (status === 'PASS') return <CheckCircle2 className="w-4 h-4 text-ww-cyan" />;
    if (status === 'FAIL') return <XCircle className="w-4 h-4 text-ww-pink-deep" />;
    return <Circle className="w-4 h-4 text-white/10" />;
  };

  return (
      <div className="space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700 uppercase">
       {/* HEADER */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase font-black tracking-[4px] text-ww-cyan">PHASE 9 PROTOCOL</span>
        <h2 className="text-6xl font-black tracking-tighter leading-none italic uppercase">CONVERSION SYSTEM</h2>
        <p className="text-white/60 font-medium normal-case">Turn attention into action through structured movement.</p>
      </div>

      {/* SECTIONS */}
      <div className="space-y-6">
          {/* MESSAGING */}
          <div className={cn("border transition-all", sectionStatus.messaging === 'PASS' ? "border-ww-cyan/30" : "border-white/5")}>
             <button onClick={() => setExpandedSections(prev => prev.includes('messaging') ? prev.filter(s => s !== 'messaging') : [...prev, 'messaging'])}
                className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                   <h4 className="text-sm font-black italic tracking-tighter uppercase">🔥 Messaging</h4>
                   <StatusIconLocal status={sectionStatus.messaging} validating={validating === 'messaging'} />
                </div>
                {expandedSections.includes('messaging') ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
             </button>
             <AnimatePresence>
                {expandedSections.includes('messaging') && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-ww-charcoal/40">
                     <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <MethodItem title="What this controls" content="This controls clarity and meaning." />
                            <MethodItem title="How to apply it" content="Make sure people understand what your content is saying." />
                            <MethodItem title="Failure point" content="If messaging is weak, attention does not convert." />
                          </div>
                          <div className="space-y-4">
                            <MethodItem title="What to do" content="Clarify the message behind the content." />
                            <MethodItem title="Definition — What to do" content="What to do is ensuring clear communication." />
                            <MethodItem title="Bot application" content="Use the bot to detect unclear messaging." />
                            <MethodItem title="Action step" content="Write one clear message behind your post." />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <BuildInput
                            label="Define your message"
                            description="Must be clear and understandable without context. BLOCK vague words (value, things, stuff)."
                            value={form.messaging}
                            mode={navMode}
                            onChange={(val) => {
                              setForm(prev => ({ ...prev, messaging: val }));
                              setSectionStatus(prev => ({ ...prev, messaging: null }));
                            }}
                          />
                          <div className="flex items-center justify-between">
                             <span className="text-[10px] font-bold text-ww-pink-deep">{getLiveWarning('messaging', form.messaging)}</span>
                             <button onClick={() => validateSection('messaging')} disabled={validating !== null} className="px-6 py-2 bg-ww-cyan/10 border border-ww-cyan/20 text-[9px] font-black tracking-widest text-ww-cyan hover:bg-ww-cyan/20">
                               [ CHECK MESSAGING ]
                             </button>
                          </div>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* CONVERSION */}
          <div className={cn("border transition-all", sectionStatus.conversion === 'PASS' ? "border-ww-cyan/30" : "border-white/5")}>
             <button onClick={() => setExpandedSections(prev => prev.includes('conversion') ? prev.filter(s => s !== 'conversion') : [...prev, 'conversion'])}
                className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                   <h4 className="text-sm font-black italic tracking-tighter uppercase">⭕️ Conversion</h4>
                   <StatusIconLocal status={sectionStatus.conversion} validating={validating === 'conversion'} />
                </div>
                {expandedSections.includes('conversion') ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
             </button>
             <AnimatePresence>
                {expandedSections.includes('conversion') && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-ww-charcoal/40">
                     <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                             <MethodItem title="What this controls" content="This controls movement." />
                             <MethodItem title="How to apply it" content="Guide the viewer toward a next step." />
                             <MethodItem title="Failure point" content="Without conversion, attention stays passive." />
                           </div>
                           <div className="space-y-4">
                             <MethodItem title="What to do" content="Direct attention into action." />
                             <MethodItem title="Definition — What to do" content="What to do is guiding movement." />
                             <MethodItem title="Bot application" content="Use the bot to detect passive content." />
                             <MethodItem title="Action step" content="Add one clear next step." />
                           </div>
                        </div>
                        <div className="space-y-4">
                          <BuildInput
                            label="What action should they take?"
                            description="Must include a clear action (reply, click, DM, etc.) and be direct."
                            value={form.conversion}
                            mode={navMode}
                            onChange={(val) => {
                              setForm(prev => ({ ...prev, conversion: val }));
                              setSectionStatus(prev => ({ ...prev, conversion: null }));
                            }}
                          />
                          <div className="flex justify-end">
                             <button onClick={() => validateSection('conversion')} disabled={validating !== null} className="px-6 py-2 bg-ww-cyan/10 border border-ww-cyan/20 text-[9px] font-black tracking-widest text-ww-cyan hover:bg-ww-cyan/20">
                               [ CHECK CONVERSION ]
                             </button>
                          </div>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* STRUCTURE */}
          <div className={cn("border transition-all", sectionStatus.structure === 'PASS' ? "border-ww-cyan/30" : "border-white/5")}>
             <button onClick={() => setExpandedSections(prev => prev.includes('structure') ? prev.filter(s => s !== 'structure') : [...prev, 'structure'])}
                className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                   <h4 className="text-sm font-black italic tracking-tighter uppercase">❤️‍🔥 Structure</h4>
                   <StatusIconLocal status={sectionStatus.structure} validating={validating === 'structure'} />
                </div>
                {expandedSections.includes('structure') ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
             </button>
             <AnimatePresence>
                {expandedSections.includes('structure') && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-ww-charcoal/40">
                     <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                             <MethodItem title="What this controls" content="This controls consistency in how people move." />
                             <MethodItem title="How to apply it" content="Repeat the same conversion flow." />
                             <MethodItem title="Failure point" content="If structure changes, people get confused." />
                           </div>
                           <div className="space-y-4">
                             <MethodItem title="What to do" content="Keep conversion flow consistent." />
                             <MethodItem title="Definition — What to do" content="What to do is repeating the same path to action." />
                             <MethodItem title="Bot application" content="Use the bot to detect inconsistency." />
                             <MethodItem title="Action step" content="Define one repeatable conversion flow." />
                           </div>
                        </div>
                        <div className="space-y-4">
                          <BuildInput
                            label="Define your conversion flow"
                            description="Must include steps and be repeatable."
                            value={form.structure}
                            mode={navMode}
                            onChange={(val) => {
                              setForm(prev => ({ ...prev, structure: val }));
                              setSectionStatus(prev => ({ ...prev, structure: null }));
                            }}
                          />
                          <div className="flex justify-end">
                             <button onClick={() => validateSection('structure')} disabled={validating !== null} className="px-6 py-2 bg-ww-cyan/10 border border-ww-cyan/20 text-[9px] font-black tracking-widest text-ww-cyan hover:bg-ww-cyan/20">
                               [ CHECK STRUCTURE ]
                             </button>
                          </div>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* AUDIENCE MOVEMENT */}
          <div className={cn("border transition-all", sectionStatus.movement === 'PASS' ? "border-ww-cyan/30" : "border-white/5")}>
             <button onClick={() => setExpandedSections(prev => prev.includes('movement') ? prev.filter(s => s !== 'movement') : [...prev, 'movement'])}
                className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                   <h4 className="text-sm font-black italic tracking-tighter uppercase">🩷 Audience Movement</h4>
                   <StatusIconLocal status={sectionStatus.movement} validating={validating === 'movement'} />
                </div>
                {expandedSections.includes('movement') ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
             </button>
             <AnimatePresence>
                {expandedSections.includes('movement') && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-ww-charcoal/40">
                     <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                             <MethodItem title="What this controls" content="This controls progression." />
                             <MethodItem title="How to apply it" content="Move people through stages: attention → engagement → understanding → decision" />
                             <MethodItem title="Failure point" content="If movement is unclear, people don’t progress." />
                           </div>
                           <div className="space-y-4">
                             <MethodItem title="What to do" content="Guide audience step-by-step." />
                             <MethodItem title="Definition — What to do" content="What to do is structuring progression." />
                             <MethodItem title="Bot application" content="Use the bot to detect stagnation." />
                             <MethodItem title="Action step" content="Define what step your content moves them into." />
                           </div>
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {['Attention', 'Engagement', 'Understanding', 'Decision'].map((stage) => (
                               <button
                                 key={stage}
                                 onClick={() => {
                                   setForm(prev => ({ ...prev, movement: stage as any }));
                                   setSectionStatus(prev => ({ ...prev, movement: null }));
                                 }}
                                 disabled={!isBuildMode}
                                 className={cn(
                                   "p-6 text-center border font-black tracking-tighter uppercase italic transition-all",
                                   form.movement === stage ? "bg-ww-cyan border-ww-cyan text-ww-charcoal" : "border-white/10 text-white/40 hover:border-white/30"
                                 )}
                               >
                                 {stage}
                               </button>
                            ))}
                          </div>
                          <div className="flex justify-end">
                             <button onClick={() => validateSection('movement')} disabled={validating !== null} className="px-6 py-2 bg-ww-cyan/10 border border-ww-cyan/20 text-[9px] font-black tracking-widest text-ww-cyan hover:bg-ww-cyan/20">
                               [ CHECK MOVEMENT ]
                             </button>
                          </div>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* DM FLOW */}
          <div className={cn("border transition-all", sectionStatus.dmFlow === 'PASS' ? "border-ww-cyan/30" : "border-white/5")}>
             <button onClick={() => setExpandedSections(prev => prev.includes('dmFlow') ? prev.filter(s => s !== 'dmFlow') : [...prev, 'dmFlow'])}
                className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black italic tracking-tighter uppercase">DM Flow</span>
                  <StatusIconLocal status={sectionStatus.dmFlow} validating={validating === 'dmFlow'} />
                </div>
                {expandedSections.includes('dmFlow') ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
             </button>
             <AnimatePresence>
                {expandedSections.includes('dmFlow') && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-ww-charcoal/40">
                     <div className="p-8 space-y-12">
                        <div className="flex items-center justify-between w-full max-w-2xl mx-auto text-[10px] font-black tracking-widest text-white/20 italic overflow-x-auto pb-4">
                          <span>[ DIAGNOSE ]</span>
                          <ChevronRight className="w-3 h-3" />
                          <span>[ SEGMENT ]</span>
                          <ChevronRight className="w-3 h-3" />
                          <span>[ REFRAME ]</span>
                          <ChevronRight className="w-3 h-3" />
                          <span>[ OFFER ]</span>
                          <ChevronRight className="w-3 h-3" />
                          <span>[ CLOSE ]</span>
                        </div>

                        <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
                            <BuildInput
                              label="Diagnose: What is their real problem?"
                              description="Must go deeper than surface issue."
                              value={form.dmFlow.diagnose}
                              mode={navMode}
                              onChange={(val) => setForm(prev => ({ ...prev, dmFlow: { ...prev.dmFlow, diagnose: val } }))}
                            />
                            <BuildInput
                              label="Segment: Who are they?"
                              description="Must classify type of person."
                              value={form.dmFlow.segment}
                              mode={navMode}
                              onChange={(val) => setForm(prev => ({ ...prev, dmFlow: { ...prev.dmFlow, segment: val } }))}
                            />
                            <BuildInput
                              label="Reframe: How do you shift their perspective?"
                              description="Must introduce new way of thinking."
                              value={form.dmFlow.reframe}
                              mode={navMode}
                              onChange={(val) => setForm(prev => ({ ...prev, dmFlow: { ...prev.dmFlow, reframe: val } }))}
                            />
                            <BuildInput
                              label="Offer: How does your offer solve this?"
                              description="Must connect directly to problem."
                              value={form.dmFlow.offer}
                              mode={navMode}
                              onChange={(val) => setForm(prev => ({ ...prev, dmFlow: { ...prev.dmFlow, offer: val } }))}
                            />
                            <BuildInput
                              label="Close: What decision are you asking for?"
                              description="Must be direct and require response."
                              value={form.dmFlow.close}
                              mode={navMode}
                              onChange={(val) => setForm(prev => ({ ...prev, dmFlow: { ...prev.dmFlow, close: val } }))}
                            />
                        </div>

                        <div className="flex justify-end">
                           <button onClick={() => validateSection('dmFlow')} disabled={validating !== null} className="px-6 py-2 bg-ww-cyan/10 border border-ww-cyan/20 text-[9px] font-black tracking-widest text-ww-cyan hover:bg-ww-cyan/20">
                             [ CHECK DM FLOW ]
                           </button>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
      </div>

       {errorMessage && (
        <div className="p-4 bg-ww-pink-deep/10 border border-ww-pink-deep/20 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-ww-pink-deep shrink-0 mt-0.5" />
          <p className="text-xs font-black tracking-widest text-ww-pink-deep uppercase">{errorMessage}</p>
        </div>
      )}

      {/* FINAL LOCK */}
      <div className="pt-20 border-t border-white/10 text-center">
         {isAllPassed ? (
           <div className="space-y-8">
             <div className="p-8 bg-ww-cyan/5 border border-ww-cyan/20 animate-in zoom-in duration-500">
               <span className="text-[10px] font-black tracking-[4px] text-ww-cyan uppercase">PROTOCOL_SYNC_COMPLETE</span>
               <p className="enforcement-text mt-4">Conversion System stabilized and ready for execution.</p>
             </div>
             <button
                onClick={handleLock}
                className="initialize-btn w-full md:w-[400px] mx-auto flex items-center justify-center gap-3"
             >
                <Lock className="w-4 h-4" /> [ LOCK CONVERSION SYSTEM ]
             </button>
           </div>
         ) : (
           <div className="p-12 border border-white/5 bg-white/2">
             <p className="enforcement-text normal-case opacity-40">
               ENFORCEMENT_PROTOCOL_ACTIVE // STABILIZE_ALL_CONVERSION_LAYERS_TO_LOCK
             </p>
           </div>
         )}
      </div>
    </div>
  );
}

function Phase10ControlSystem({ data, onSave, onNavigate, isLocked, isDevMode, navMode }: { 
  data: any, onSave: (data: any) => void, onNavigate?: (idx: number) => void, isLocked: boolean, isDevMode?: boolean, navMode: 'REVIEW' | 'BUILD' 
}) {
  const isBuildMode = navMode === 'BUILD';
  const [form, setForm] = useState<Phase10Data>(data.phase10 || {
    botRole: '',
    botAccess: ''
  });

  const [expandedSections, setExpandedSections] = useState<string[]>(['role']);
  const [validating, setValidating] = useState<string | null>(null);
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'PASS' | 'FAIL' | null>>({
    role: data.phase10?.botRole ? 'PASS' : null,
    access: data.phase10?.botAccess ? 'PASS' : null
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const arePreviousPhasesComplete = useMemo(() => {
    const phases = ['phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'phase6', 'phase7', 'phase8', 'phase9'];
    return phases.every(p => data[p] !== undefined);
  }, [data]);

  const validateSection = async (section: string) => {
    setValidating(section);
    setErrorMessage(null);

    const input = section === 'role' ? form.botRole : form.botAccess;
    
    if (input.length < 10) {
      setSectionStatus(prev => ({ ...prev, [section]: 'FAIL' }));
      setErrorMessage("Input too short. Define with precision.");
      setValidating(null);
      return;
    }

    try {
      const result = await analyzeSystemInput(
        `PHASE 10: CONTROL SYSTEM - ${section.toUpperCase()}
         Input: ${input}
         Context: Enforce strict boundaries on bot usage. The bot is for REFINEMENT, not creation. 
         Block vague thinking. Block dependency. Block "generate everything".
         For ROLE: Must acknowledge bot as enforcement, not creator.
         For ACCESS: Must define bot usage after system is defined, on one section only.`
      );

      if (!result.passed) {
        setSectionStatus(prev => ({ ...prev, [section]: 'FAIL' }));
        setErrorMessage(result.reasons[0] || "Thinking too vague. Refine the control boundary.");
      } else {
        setSectionStatus(prev => ({ ...prev, [section]: 'PASS' }));
      }
    } catch (err) {
      setErrorMessage("Validation error. Try again.");
    } finally {
      setValidating(null);
    }
  };

  const handleLock = () => {
    onSave({ ...data, phase10: form, completed: true });
  };

  const isAllPassed = sectionStatus.role === 'PASS' && sectionStatus.access === 'PASS' && arePreviousPhasesComplete;

  const StatusIconLocal = ({ status, validating }: { status: 'PASS' | 'FAIL' | null, validating: boolean }) => {
    if (validating) return <Loader2 className="w-4 h-4 text-ww-cyan animate-spin" />;
    if (status === 'PASS') return <CheckCircle2 className="w-4 h-4 text-ww-cyan" />;
    if (status === 'FAIL') return <XCircle className="w-4 h-4 text-ww-pink-deep" />;
    return <Circle className="w-4 h-4 text-white/10" />;
  };

  return (
    <div className="space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700 uppercase">
       <div className="space-y-4">
        <span className="text-[10px] uppercase font-black tracking-[4px] text-ww-cyan">PHASE 10 PROTOCOL</span>
        <h2 className="text-6xl font-black tracking-tighter leading-none italic uppercase">CONTROL SYSTEM</h2>
        <p className="text-white/60 font-medium normal-case">Maintain control of your system without escaping into dependency.</p>
      </div>

      <div className="space-y-6">
          {/* BOT ROLE */}
          <div className={cn("border transition-all", sectionStatus.role === 'PASS' ? "border-ww-cyan/30" : "border-white/5")}>
             <button onClick={() => setExpandedSections(prev => prev.includes('role') ? prev.filter(s => s !== 'role') : [...prev, 'role'])}
                className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                   <h4 className="text-sm font-black italic tracking-tighter uppercase">🔥 Bot Role</h4>
                   <StatusIconLocal status={sectionStatus.role} validating={validating === 'role'} />
                </div>
                {expandedSections.includes('role') ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
             </button>
             <AnimatePresence>
                {expandedSections.includes('role') && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-ww-charcoal/40">
                     <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <MethodItem title="What this controls" content="This controls long-term system protection." />
                            <MethodItem title="How to apply it" content="Use the bot to enforce, not replace thinking." />
                            <MethodItem title="Failure point" content="If the bot does everything, the user becomes dependent." />
                          </div>
                          <div className="space-y-4">
                            <MethodItem title="What to do" content="Use the bot as enforcement, not creator." />
                            <MethodItem title="Definition — What to do" content="What to do is maintaining control without dependency." />
                            <MethodItem title="Bot application" content="Use the bot to challenge and refine." />
                            <MethodItem title="Action step" content="Use the bot to refine, not decide everything." />
                          </div>
                        </div>
                        <div className="space-y-4">
                           <div className="p-6 bg-ww-pink-deep/5 border border-ww-pink-deep/20 space-y-4">
                              <h5 className="text-xs font-black tracking-widest text-ww-pink-deep">🔥 BLOCKS VAGUE THINKING</h5>
                              <ul className="text-[10px] space-y-2 font-bold opacity-60">
                                <li>• PREVENTS COPYING</li>
                                <li>• ENFORCES DECISIONS</li>
                                <li>• MAINTAINS CONSISTENCY</li>
                              </ul>
                           </div>
                           <BuildInput
                             label="Define Bot Role Enforcement"
                             description="How will you ensure the bot enforces boundaries instead of replacing your thinking?"
                             value={form.botRole}
                             mode={navMode}
                             onChange={(val) => {
                               setForm(prev => ({ ...prev, botRole: val }));
                               setSectionStatus(prev => ({ ...prev, role: null }));
                             }}
                           />
                           <div className="flex justify-end">
                              <button onClick={() => validateSection('role')} disabled={validating !== null} className="px-6 py-2 bg-ww-cyan/10 border border-ww-cyan/20 text-[9px] font-black tracking-widest text-ww-cyan hover:bg-ww-cyan/20">
                                [ SET BOT ROLE ]
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* BOT ACCESS */}
          <div className={cn("border transition-all", sectionStatus.access === 'PASS' ? "border-ww-cyan/30" : "border-white/5")}>
             <button onClick={() => setExpandedSections(prev => prev.includes('access') ? prev.filter(s => s !== 'access') : [...prev, 'access'])}
                className="w-full flex items-center justify-between p-6 bg-white/2 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                   <h4 className="text-sm font-black italic tracking-tighter uppercase">⭕️ Bot Access</h4>
                   <StatusIconLocal status={sectionStatus.access} validating={validating === 'access'} />
                </div>
                {expandedSections.includes('access') ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
             </button>
             <AnimatePresence>
                {expandedSections.includes('access') && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-ww-charcoal/40">
                     <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <MethodItem title="What this controls" content="This controls how the bot is used without breaking the system." />
                            <MethodItem title="How to apply it" content="Only use the bot after your system is defined." />
                            <MethodItem title="Failure point" content="If used too early, the system gets skipped and becomes dependent on the bot." />
                          </div>
                          <div className="space-y-4">
                            <MethodItem title="What to do" content="Use the bot only to refine, not to build from nothing." />
                            <MethodItem title="Definition — What to do" content="What to do is controlling how the bot is used within the system." />
                            <MethodItem title="Bot application" content="Use the bot to challenge your structure, not replace it." />
                            <MethodItem title="Action step" content="Use the bot on one defined section, not the entire system." />
                          </div>
                        </div>
                        <div className="space-y-4">
                           <BuildInput
                             label="Define Access Boundary"
                             description="Define when and how you will grant yourself access to the bot."
                             value={form.botAccess}
                             mode={navMode}
                             onChange={(val) => {
                               setForm(prev => ({ ...prev, botAccess: val }));
                               setSectionStatus(prev => ({ ...prev, access: null }));
                             }}
                           />
                           <div className="flex justify-end">
                              <button onClick={() => validateSection('access')} disabled={validating !== null} className="px-6 py-2 bg-ww-cyan/10 border border-ww-cyan/20 text-[9px] font-black tracking-widest text-ww-cyan hover:bg-ww-cyan/20">
                                [ SET ACCESS BOUNDARY ]
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-ww-pink-deep/10 border border-ww-pink-deep/20 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-ww-pink-deep shrink-0 mt-0.5" />
          <p className="text-xs font-black tracking-widest text-ww-pink-deep uppercase">{errorMessage}</p>
        </div>
      )}

      {/* FINAL LOCK & ACCESS */}
      <div className="pt-20 border-t border-white/10 text-center space-y-12">
          {/* BOT ACCESS SECTION - ALWAYS ACCESSIBLE */}
          <div className="space-y-12 animate-in zoom-in duration-700">
             <div className="p-8 bg-ww-cyan/5 border border-ww-cyan/20 space-y-4">
                <span className="text-[10px] font-black tracking-[4px] text-ww-cyan uppercase italic">BOT ACCESS PROTOCOL</span>
                <p className="enforcement-text mt-4">The app is where you BUILD your system. The bot is where you REFINE it.</p>
                <div className="flex flex-col items-center gap-2 text-[10px] font-bold text-white/40 italic">
                  <span>• THE BOT IS ALWAYS ACCESSIBLE</span>
                  <span>• USE THE APP FIRST, THEN THE BOT</span>
                  <span>• DO NOT RELY ON THE BOT TO BUILD YOUR SYSTEM</span>
                  <span>• RETURN TO THE APP AFTER USING THE BOT</span>
                </div>
             </div>

             <div className="space-y-6">
               <p className="text-[10px] font-black tracking-[3px] text-ww-pink-deep uppercase italic">WARNING: "DO NOT USE THE BOT TO BUILD YOUR SYSTEM. USE IT TO REFINE WHAT YOU ALREADY DEFINED."</p>
               <div className="p-4 bg-ww-pink-deep/5 border border-ww-pink-deep/10 max-w-xl mx-auto">
                 <p className="text-[9px] font-black text-ww-yellow italic uppercase">Bot Enforcement: "Define it first in the app. I refine, not replace."</p>
               </div>
               <a 
                 href="https://chatgpt.com/g/g-69b7502e1bac81919b56999bbaa43c3b-the-world-architect"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="initialize-btn w-full md:w-[450px] mx-auto flex items-center justify-center gap-3 uppercase no-underline"
               >
                  [ ACCESS THE WORLD ARCHITECT BOT ]
               </a>
               <button
                 onClick={() => {
                   onNavigate?.(3);
                   setTimeout(() => {
                     document.getElementById('phase-1')?.scrollIntoView({ behavior: 'smooth' });
                   }, 100);
                 }}
                 className="text-ww-cyan font-black text-[10px] tracking-widest uppercase border border-ww-cyan/30 px-8 py-3 hover:bg-ww-cyan/10 transition-all w-full md:w-[450px] mx-auto block"
               >
                 [ REFINE YOUR SYSTEM ]
               </button>
             </div>

             {isAllPassed ? (
               <div className="space-y-8 flex flex-col items-center">
                 <button
                   onClick={() => {
                     onNavigate?.(3);
                     setTimeout(() => {
                       document.getElementById('phase-1')?.scrollIntoView({ behavior: 'smooth' });
                     }, 100);
                   }}
                   className="text-ww-cyan font-black text-[10px] tracking-widest uppercase border border-ww-cyan/30 px-8 py-3 hover:bg-ww-cyan/10 transition-all"
                 >
                   [ REFINE YOUR SYSTEM ]
                 </button>
                 <div className="space-y-2 w-full max-w-[400px]">
                   <button
                      onClick={handleLock}
                      className="w-full px-8 py-3 bg-white/5 border border-white/10 text-[10px] font-black tracking-[4px] text-white/40 hover:bg-white/10 transition-all animate-in fade-in"
                   >
                      [ LOCK SYSTEM & FINALIZE ]
                   </button>
                 </div>
               </div>
             ) : (
                <div className="p-10 border border-white/5 bg-white/2 max-w-xl mx-auto">
                   <p className="enforcement-text normal-case opacity-40 italic">
                     ENFORCEMENT_PROTOCOL_ACTIVE // STABILIZE_CONTROL_LAYERS_TO_FINALIZE_SYSTEM
                   </p>
                </div>
             )}
          </div>
      </div>
    </div>
  );
}

function BuildInput({ label, description, value, mode, onChange, onBlur }: { 
  label: string, description?: string, value: string, mode: 'REVIEW' | 'BUILD', onChange: (val: string) => void, onBlur?: () => void 
}) {
  return (
    <div className="space-y-4 group">
      <label className="text-[10px] uppercase font-black tracking-widest text-ww-cyan group-hover:text-ww-pink-rose transition-colors">{label}</label>
      {description && <p className="text-[9px] text-white/40 italic font-medium">{description}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={mode === 'REVIEW'}
        className={cn(
          "w-full bg-white/2 border border-white/10 p-6 text-white/80 font-medium focus:outline-none focus:border-ww-pink-rose transition-all resize-none min-h-[100px]",
          mode === 'REVIEW' && "opacity-50 border-white/5 cursor-default"
        )}
        placeholder={mode === 'REVIEW' ? "NOT REQUIRED IN REVIEW MODE" : "Provide specific definition..."}
      />
    </div>
  );
}

// --- PROGRESSION SYSTEM BLOCKS ---

function SystemProgressBlock() {
  return (
    <div className="p-8 border border-ww-cyan/20 bg-ww-cyan/5 space-y-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-4 border-b border-ww-cyan/10 pb-4">
        <span className="text-xl">⭕️</span>
        <h3 className="text-xs font-black tracking-[4px] text-ww-cyan uppercase text-center">SYSTEM PROGRESS</h3>
      </div>
      <div className="space-y-4 text-[10px] uppercase font-black tracking-widest opacity-70 italic text-center">
        <p>This system is built in layers.</p>
        <p>Each phase completed strengthens the system.</p>
        <p>If phases are skipped, the system weakens.</p>
      </div>
      <div className="pt-4 border-t border-ww-cyan/10 text-center space-y-2">
        <p className="text-[10px] font-black tracking-[4px] text-ww-cyan uppercase">Progress is not speed.</p>
        <p className="text-white/40 text-[9px] uppercase font-black">Progress is structure.</p>
      </div>
    </div>
  );
}

function PhaseCompleteBlock() {
  return (
    <div className="p-8 border border-ww-cyan/20 bg-ww-cyan/5 space-y-4 animate-in zoom-in duration-500 overflow-hidden relative mb-12">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <CheckCircle2 className="w-24 h-24 text-ww-cyan" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-ww-cyan font-black text-xl">✔</span>
        <h3 className="text-xs font-black tracking-[4px] text-ww-cyan uppercase">PHASE COMPLETE</h3>
      </div>
      <div className="space-y-2 border-t border-ww-cyan/10 pt-4">
        <p className="text-[10px] font-black tracking-widest uppercase text-white/80">This layer is now defined.</p>
        <p className="text-[9px] font-medium italic text-white/40">Move forward only when this feels clear.</p>
      </div>
    </div>
  );
}

function RefineLoopBlock() {
  return (
    <div className="p-12 border border-ww-cyan/20 bg-ww-cyan/5 space-y-12 animate-in fade-in duration-1000 max-w-4xl mx-auto">
      <div className="flex flex-col items-center justify-center gap-6 border-b border-white/5 pb-8 text-center">
        <span className="text-4xl">🔁</span>
        <h3 className="text-sm font-black tracking-[8px] text-ww-cyan uppercase">SYSTEM REFINEMENT</h3>
      </div>
      
      <div className="text-center space-y-6">
        <p className="text-3xl font-black italic tracking-tighter uppercase text-white/90 leading-none">
          Your system is not finished. <br/>
          <span className="text-ww-cyan">It is meant to be refined.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] uppercase tracking-widest font-black">
        <MethodItem title="What this controls" content="This controls long-term system evolution." />
        <MethodItem title="How to apply it" content="Return to earlier phases and refine what you already built." />
        <MethodItem title="Failure point" content="If you never revisit your system, it becomes static." />
        <MethodItem title="What to do" content="Re-enter the system and refine weak areas." />
      </div>

      <div className="p-8 bg-white/2 border border-white/10 space-y-6">
        <MethodItem title="Definition — What to do" content="What to do is repeating the system to strengthen it over time." />
        <MethodItem title="Bot application" content="Use the bot to detect what needs refinement." />
        <MethodItem title="Definition — Bot application" content="Bot application is identifying weaknesses and forcing iteration." />
        <MethodItem title="Action step" content="Return to one previous phase and improve it." />
        <MethodItem title="Definition — Action step" content="An action step is one enforced iteration that strengthens the system." />
      </div>

      <div className="text-center space-y-8 pt-8 border-t border-white/5">
        <div className="space-y-4">
          <p className="text-xl font-bold uppercase tracking-tighter italic">"You are not restarting. <br/>You are refining what you already built."</p>
        </div>
        
        <button 
          onClick={() => document.getElementById('phase-1')?.scrollIntoView({ behavior: 'smooth' })}
          className="initialize-btn w-full md:w-[400px] mx-auto flex items-center justify-center gap-4"
        >
          [ REFINE YOUR SYSTEM ]
        </button>
      </div>
    </div>
  );
}
