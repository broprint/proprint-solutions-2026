'use client';

import Link from 'next/link';
import { Bot, ChevronRight, Headphones, MessageCircle, Send, UserRoundCheck, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

type Reply = {
  text: string;
  href?: string;
  actionLabel?: string;
  options?: string[];
};

type Message = {
  role: 'assistant' | 'user';
  text: string;
  reply?: Reply;
};

type LeadState = {
  name: string;
  phone: string;
  company: string;
};

const QUICK_ACTIONS = [
  'Buy a Product',
  'Laptop / Desktop Repair',
  'Printer Repair',
  'Plotter Repair',
  'AMC Support',
  'Enterprise IT',
  'Request a Quote',
];

function getReply(input: string, history: Message[] = []): Reply {
  const text = input.toLowerCase();
  const recentUserMessages = history
    .filter((message) => message.role === 'user')
    .slice(-8)
    .map((message) => message.text.toLowerCase());
  const recentUserContext = recentUserMessages.join(' ');
  const context = `${recentUserContext} ${text}`;

  const priceQuestion = /(how much|price|cost|charge|charges|quotation|quote)/.test(text);
  const etaQuestion = /(eta|how long|time|when|days|ready|finish|complete)/.test(text);
  const brandOnly = /^(hp|dell|lenovo|asus|acer|msi|apple|canon|epson|brother|xerox|ricoh|kyocera)$/i.test(input.trim());
  const knownComputerBrand = [...recentUserMessages, text].reverse().find((value) => /\b(hp|dell|lenovo|asus|acer|msi|apple)\b/.test(value))?.match(/\b(hp|dell|lenovo|asus|acer|msi|apple)\b/)?.[1];

  const laptopContext = /(laptop|notebook|desktop|pc|workstation|hp|dell|lenovo|asus|acer|msi|apple|macbook)/.test(context);
  const printerContext = /(printer|laserjet|officejet|deskjet|inkjet|mfp|multifunction|canon|epson|brother|xerox|ricoh|kyocera)/.test(context);
  const plotterContext = /(plotter|designjet|surecolor|large format|wide format)/.test(context);

  const screenContext = /(lcd|screen|display|panel|cracked|broken screen)/.test(context);
  const storageContext = /(ssd|hard disk|hard drive|hdd|nvme|storage|disk)/.test(context);
  const ramContext = /(ram|memory|upgrade memory)/.test(context);
  const powerContext = /(not powering|no power|dead|charging|charger|dc jack|adapter|battery)/.test(context);
  const keyboardContext = /(keyboard|keys|touchpad|trackpad)/.test(context);
  const hingeContext = /(hinge|body|casing|cover|bezel)/.test(context);
  const overheatingContext = /(heat|heating|overheat|fan|thermal|shutdown|very slow|slow performance)/.test(context);

  const paperJam = /(paper jam|jammed|paper stuck|does not feed|not feeding|feed issue|pickup)/.test(context);
  const printQuality = /(line|lines|streak|faded|fading|blur|smudge|print quality|blank page|colour issue|color issue)/.test(context);
  const tonerInk = /(toner|cartridge|ink|ink system|ink error)/.test(context);
  const printerError = /(error code|service error|firmware|offline|not detected|not printing|won't print|wont print)/.test(context);
  const printerHardware = /(fuser|formatter|mainboard|board|roller|pickup roller|scanner|adf|duplex|motor)/.test(context);

  const plotterMedia = /(media|paper|roll|roll feed|sheet feed|cutter|cutting|carriage|belt)/.test(context);
  const plotterPrinthead = /(printhead|print head|nozzle|ink system|maintenance cartridge)/.test(context);

  const capacityMatch = text.match(/\b(500\s?gb|1\s?tb|2\s?tb)\b/i);
  const capacitySelected = capacityMatch?.[1]?.replace(/\s+/g, '').toUpperCase();

  if (/(outside kuwait|saudi|dubai|uae|qatar|bahrain|oman|india|uk|international|overseas)/.test(text)) {
    return {
      text: 'This ProPrint website assistant is currently configured for Kuwait enquiries only. For requirements outside Kuwait, please contact ProPrint directly before assuming delivery or service coverage.',
      href: '/contact',
      actionLabel: 'Contact ProPrint',
    };
  }

  if (/^(laptop|desktop|laptop repair|desktop repair|laptop \/ desktop repair)$/i.test(input.trim())) {
    return {
      text: 'Yes, we repair laptops and desktops in Kuwait. What brand and model is your computer, and what problem are you having?',
      href: '/service',
      actionLabel: 'Open Service Request',
    };
  }

  if (brandOnly && laptopContext && !printerContext && !plotterContext) {
    return {
      text: `Sure — we handle ${input.trim().toUpperCase()} computer repairs. What is the exact model, and what issue are you having with it?`,
      href: '/service',
      actionLabel: 'Open Service Request',
    };
  }

  if (capacitySelected && storageContext) {
    const brandPhrase = knownComputerBrand ? ` for your ${knownComputerBrand.toUpperCase()} computer` : '';
    return {
      text: `You selected ${capacitySelected}${brandPhrase}. I can prepare a price request for that SSD capacity. The final amount depends on the compatible SSD type for the exact model and current ProPrint/vendor price. Would you like ProPrint to check this ${capacitySelected} option?`,
      href: '/service',
      actionLabel: `Request ${capacitySelected} SSD Price`,
    };
  }

  if (laptopContext && storageContext) {
    const brandPhrase = knownComputerBrand ? ` for your ${knownComputerBrand.toUpperCase()} computer` : '';
    return {
      text: `Yes, we can replace or upgrade the SSD${brandPhrase}. Choose the capacity you want a price for:`,
      options: ['500GB', '1TB', '2TB'],
      href: '/service',
      actionLabel: 'Open Storage Upgrade Request',
    };
  }

  if (laptopContext && ramContext) {
    const brandPhrase = knownComputerBrand ? ` for your ${knownComputerBrand.toUpperCase()} computer` : '';
    return {
      text: `Yes, we can check a RAM upgrade${brandPhrase}. What is the exact model, and how much memory would you like — for example 16GB or 32GB? We will confirm compatibility before quoting the part.`,
      href: '/service',
      actionLabel: 'Request RAM Upgrade',
    };
  }

  if (laptopContext && screenContext && priceQuestion) {
    return {
      text: 'Yes, we can check an LCD/display replacement. Please give me the exact laptop model or product number. The final price and ETA depend on the correct screen specification and current part availability.',
      href: '/service',
      actionLabel: 'Submit Laptop Model',
    };
  }

  if (laptopContext && screenContext) {
    return {
      text: 'Yes, we can help with the laptop display. What is the exact model, and is the screen cracked, blank, flickering, showing lines or very dim?',
      href: '/service',
      actionLabel: 'Request LCD Service',
    };
  }

  if (laptopContext && powerContext) {
    return {
      text: 'We can check that. Does the computer have no power at all, fail to boot, work only on the charger, or fail to charge the battery? Please also give me the exact model.',
      href: '/service',
      actionLabel: 'Submit Power Fault',
    };
  }

  if (laptopContext && keyboardContext) {
    return {
      text: 'Yes, we can check the keyboard or touchpad. What is the exact model, and are only some keys affected, the whole keyboard not working, or is there physical or liquid damage?',
      href: '/service',
      actionLabel: 'Submit Keyboard Fault',
    };
  }

  if (laptopContext && hingeContext) {
    return {
      text: 'Yes, we can assess hinge and casing damage. What is the exact model, and is the hinge loose, broken away from the body, or is the cover/bezel also damaged?',
      href: '/service',
      actionLabel: 'Submit Physical Damage',
    };
  }

  if (laptopContext && overheatingContext) {
    return {
      text: 'We can check that. What is the exact model? Also tell me whether it is simply running slowly, becoming very hot, making loud fan noise, or shutting down by itself.',
      href: '/service',
      actionLabel: 'Request Computer Diagnosis',
    };
  }

  if (laptopContext && etaQuestion) {
    return {
      text: 'The repair time depends on the diagnosis and whether any required part is available locally. Give me the exact model and fault, and ProPrint can confirm the ETA after checking the required part.',
      href: '/service',
      actionLabel: 'Submit Computer Details',
    };
  }

  if (/(do you repair|can you repair|repair hp|repair dell|repair lenovo|laptop repair|desktop repair|computer repair)/.test(context)) {
    return {
      text: 'Yes, ProPrint repairs laptops and desktops in Kuwait. What brand and model is your computer, and what problem are you having?',
      href: '/service',
      actionLabel: 'Start Computer Service Request',
    };
  }

  if (/^(printer|printer repair)$/i.test(input.trim())) {
    return {
      text: 'Yes, we repair printers in Kuwait. What brand and model is the printer, and what problem are you having?',
      href: '/service',
      actionLabel: 'Open Printer Service Request',
    };
  }

  if (printerContext && paperJam) {
    return {
      text: 'We can check the paper-jam or feed problem. What is the exact printer model, and does it jam every page or only sometimes? If you can see where the paper stops, tell me that too.',
      href: '/service',
      actionLabel: 'Submit Paper Feed Fault',
    };
  }

  if (printerContext && printQuality) {
    return {
      text: 'We can check the print-quality issue. What is the exact printer model, and are you seeing faded print, lines, streaks, smudging, missing colours, blank pages or repeated marks?',
      href: '/service',
      actionLabel: 'Submit Print Quality Issue',
    };
  }

  if (printerContext && tonerInk) {
    return {
      text: 'Yes, we can check toner, cartridge and ink-system issues. What is the exact printer model, and what error or symptom are you seeing?',
      href: '/service',
      actionLabel: 'Submit Toner / Ink Issue',
    };
  }

  if (printerContext && printerHardware) {
    return {
      text: 'Yes, we can assess that printer hardware fault. Please give me the exact model and the error or symptom. Final part pricing and ETA are confirmed after diagnosis and a vendor stock check.',
      href: '/service',
      actionLabel: 'Submit Printer Hardware Fault',
    };
  }

  if (printerContext && printerError) {
    return {
      text: 'Please give me the exact printer model and the error code or message. If it simply does not print, tell me whether it is connected by USB, network/Wi-Fi, or shows Offline.',
      href: '/service',
      actionLabel: 'Submit Printer Error',
    };
  }

  if (printerContext && priceQuestion) {
    return {
      text: 'Printer repair cost depends on the model and diagnosed fault. ProPrint can advise the service charge, while any required spare part is quoted at the current vendor price. Please give me the exact model and fault so the request can be checked.',
      href: '/service',
      actionLabel: 'Request Printer Quote',
    };
  }

  if (printerContext && etaQuestion) {
    return {
      text: 'Printer repair time depends on the diagnosis and spare-part availability. Please give me the exact model and fault; ProPrint can confirm the ETA after checking what the repair requires.',
      href: '/service',
      actionLabel: 'Submit Printer Details',
    };
  }

  if (/^(plotter|plotter repair)$/i.test(input.trim())) {
    return {
      text: 'Yes, we repair plotters and large-format printers in Kuwait. What brand and model is the machine, and what problem are you having?',
      href: '/service',
      actionLabel: 'Open Plotter Service Request',
    };
  }

  if (plotterContext && plotterPrinthead) {
    return {
      text: 'We can check the printhead or ink-system fault. What is the exact plotter model, and is there an error code or message on the display?',
      href: '/service',
      actionLabel: 'Submit Plotter Ink-System Fault',
    };
  }

  if (plotterContext && plotterMedia) {
    return {
      text: 'We can assess the media-feed, carriage, belt or cutter problem. What is the exact plotter model, and what happens when you try to print or load media?',
      href: '/service',
      actionLabel: 'Submit Plotter Mechanical Fault',
    };
  }

  if (plotterContext && printQuality) {
    return {
      text: 'We can check the plotter print-quality issue. What is the exact model, and are you seeing banding, missing colours, lines, faded output, alignment problems or smudging?',
      href: '/service',
      actionLabel: 'Submit Plotter Print Issue',
    };
  }

  if (plotterContext && priceQuestion) {
    return {
      text: 'Plotter repair cost depends on the exact model and diagnosed fault. Service charges can be advised separately, while any required printhead or mechanical part needs current vendor pricing. Please give me the model and fault.',
      href: '/service',
      actionLabel: 'Request Plotter Quote',
    };
  }

  if (plotterContext && etaQuestion) {
    return {
      text: 'Plotter repair time depends on diagnosis and model-specific part availability. Please give me the exact model and fault; ProPrint can confirm the ETA after checking the required part.',
      href: '/service',
      actionLabel: 'Submit Plotter Details',
    };
  }

  if (/(do you repair printers|repair printer|printer service)/.test(context)) {
    return {
      text: 'Yes, ProPrint repairs printers in Kuwait. What is the brand and exact model, and what problem are you having?',
      href: '/service',
      actionLabel: 'Start Printer Service Request',
    };
  }

  if (/(do you repair plotters|repair plotter|plotter service|large format repair)/.test(context)) {
    return {
      text: 'Yes, ProPrint repairs plotters and large-format printers in Kuwait. What is the brand and exact model, and what problem are you having?',
      href: '/service',
      actionLabel: 'Start Plotter Service Request',
    };
  }

  if (/(amc|annual maintenance|maintenance contract)/.test(text)) {
    return {
      text: 'For Kuwait businesses, ProPrint can discuss AMC coverage for IT and printing environments. The exact scope, number of devices, brands/models, preventive-maintenance schedule and response terms are confirmed through a business quotation.',
      href: '/amc',
      actionLabel: 'View AMC Services',
    };
  }

  if (/(enterprise|onsite|field service|infrastructure|networking|server support|it support|corporate)/.test(text)) {
    return {
      text: 'ProPrint provides enterprise IT and field-support capabilities in Kuwait, including infrastructure, onsite technical support and business IT services. Requirements are reviewed before confirming coverage or response times.',
      href: '/enterprise',
      actionLabel: 'Enterprise IT',
    };
  }

  if (/(quote|quotation|rfq|proposal|bulk|business price)/.test(text)) {
    return {
      text: 'I can take you to the ProPrint quotation form. Add your company, phone number, equipment or product requirement and quantity. A request reference will be generated.',
      href: '/quote',
      actionLabel: 'Request a Quote',
    };
  }

  if (/(contact|phone|email|whatsapp|talk|human|person|sales)/.test(text)) {
    return {
      text: 'You can contact ProPrint through the website contact page for sales, service or corporate enquiries in Kuwait. Direct WhatsApp handoff can be enabled once the approved business number is confirmed.',
      href: '/contact',
      actionLabel: 'Contact ProPrint',
    };
  }

  if (/(price|stock|availability|available|buy|product|printer|plotter|laptop|desktop|monitor|network|server|storage)/.test(text)) {
    return {
      text: 'I can help you browse ProPrint products for Kuwait. Website prices and availability are currently indicative for the management demo, so final stock and commercial pricing should be confirmed by ProPrint.',
      href: '/shop',
      actionLabel: 'Browse Products',
    };
  }

  return {
    text: 'Tell me what equipment you have and what you need help with. For a repair, the brand, exact model and symptom are the best place to start.',
  };
}

export function ProPrintAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [leadOpen, setLeadOpen] = useState(false);
  const [lead, setLead] = useState<LeadState>({ name: '', phone: '', company: '' });
  const [leadStatus, setLeadStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [leadMessage, setLeadMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello! I’m the ProPrint Assistant for Kuwait. I can help with products, repairs, upgrades, AMC, enterprise IT and quotations. Tell me what you need help with, or choose a quick option below.',
    },
  ]);

  const lastReply = useMemo(() => [...messages].reverse().find((m) => m.reply)?.reply, [messages]);

  function ask(text: string) {
    const clean = text.trim();
    if (!clean) return;
    const reply = getReply(clean, messages);
    setMessages((current) => [
      ...current,
      { role: 'user', text: clean },
      { role: 'assistant', text: reply.text, reply },
    ]);
    setInput('');
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    ask(input);
  }

  async function submitLead(event: FormEvent) {
    event.preventDefault();
    if (!lead.name.trim() || !lead.phone.trim()) {
      setLeadStatus('error');
      setLeadMessage('Please enter your name and Kuwait contact number.');
      return;
    }

    setLeadStatus('sending');
    setLeadMessage('');

    const conversation = messages
      .filter((message) => message.role === 'user')
      .slice(-8)
      .map((message) => message.text)
      .join(' | ');

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quote',
          name: lead.name,
          phone: lead.phone,
          company: lead.company,
          requirement: 'Website assistant callback',
          message: conversation
            ? `Chatbot callback request. Recent customer enquiry: ${conversation}`
            : 'Chatbot callback request from the ProPrint Kuwait website assistant.',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to submit request.');

      setLeadStatus('success');
      setLeadMessage(
        data.delivery === 'demo'
          ? `Request ${data.reference} created for this management demo. Live email delivery is not enabled yet.`
          : `Thank you. Request ${data.reference} has been submitted to ProPrint.`
      );
    } catch (error) {
      setLeadStatus('error');
      setLeadMessage(error instanceof Error ? error.message : 'Unable to submit your request right now.');
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] sm:bottom-6 sm:right-6">
      {open && (
        <section className="mb-3 flex h-[min(680px,80vh)] w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-2xl shadow-slate-950/20" aria-label="ProPrint Assistant">
          <div className="bg-[#061321] px-5 py-4 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#0b5cff]"><Bot size={21} /></div>
                <div>
                  <p className="font-black">ProPrint Assistant</p>
                  <p className="text-xs text-slate-300">Kuwait sales & support guide</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white" aria-label="Close assistant"><X size={19} /></button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'ml-8' : 'mr-5'}>
                <div className={message.role === 'user' ? 'rounded-2xl rounded-br-md bg-[#0b5cff] px-4 py-3 text-sm leading-6 text-white' : 'rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm'}>
                  {message.text}
                </div>
                {message.reply?.options && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.reply.options.map((option) => (
                      <button key={option} onClick={() => ask(option)} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-black text-[#0b5cff] transition hover:border-[#0b5cff] hover:bg-blue-100">
                        {option}
                      </button>
                    ))}
                  </div>
                )}
                {message.reply?.href && (
                  <Link href={message.reply.href} onClick={() => setOpen(false)} className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-black text-[#0b5cff] shadow-sm ring-1 ring-slate-200">
                    {message.reply.actionLabel}<ChevronRight size={14} />
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-1">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[.12em] text-slate-400">Quick help</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <button key={action} onClick={() => ask(action)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-[#0b5cff] hover:text-[#0b5cff]">
                    {action}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3">
              <button onClick={() => { setLeadOpen((value) => !value); setLeadStatus('idle'); setLeadMessage(''); }} className="flex w-full items-center justify-between gap-3 text-left">
                <span className="flex items-center gap-2 text-sm font-black text-slate-800"><UserRoundCheck size={17} className="text-[#0b5cff]" />Have ProPrint contact me</span>
                <ChevronRight size={16} className={`text-slate-500 transition ${leadOpen ? 'rotate-90' : ''}`} />
              </button>

              {leadOpen && (
                <form onSubmit={submitLead} className="mt-3 space-y-2">
                  <input value={lead.name} onChange={(event) => setLead((current) => ({ ...current, name: event.target.value }))} placeholder="Name *" autoComplete="name" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0b5cff]" />
                  <input value={lead.phone} onChange={(event) => setLead((current) => ({ ...current, phone: event.target.value }))} placeholder="Kuwait phone *" inputMode="tel" autoComplete="tel" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0b5cff]" />
                  <input value={lead.company} onChange={(event) => setLead((current) => ({ ...current, company: event.target.value }))} placeholder="Company (optional)" autoComplete="organization" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0b5cff]" />
                  <button type="submit" disabled={leadStatus === 'sending'} className="w-full rounded-xl bg-[#0b5cff] px-4 py-2.5 text-sm font-black text-white disabled:opacity-60">
                    {leadStatus === 'sending' ? 'Submitting…' : 'Request a Callback'}
                  </button>
                  {leadMessage && <p className={`text-xs leading-5 ${leadStatus === 'error' ? 'text-red-600' : 'text-slate-600'}`}>{leadMessage}</p>}
                  <p className="text-[10px] leading-4 text-slate-400">For the management demo, a reference can be generated even while live email delivery remains disabled.</p>
                </form>
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            {lastReply?.href && <p className="mb-2 px-1 text-[10px] text-slate-400">Final prices, spare-part availability and repair ETA are confirmed by ProPrint after checking the exact model and vendor stock.</p>}
            <form onSubmit={submit} className="flex items-center gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tell me the brand, model or fault..." aria-label="Message ProPrint Assistant" className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#0b5cff]" />
              <button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f47b20] text-white" aria-label="Send message"><Send size={17} /></button>
            </form>
            <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-slate-400"><Headphones size={11} /> Guided service assistant • Kuwait only</div>
          </div>
        </section>
      )}

      <button onClick={() => setOpen((value) => !value)} className="ml-auto flex items-center gap-2 rounded-full bg-[#0b5cff] px-4 py-3.5 font-black text-white shadow-xl shadow-blue-950/25 transition hover:-translate-y-0.5" aria-expanded={open} aria-label={open ? 'Close ProPrint Assistant' : 'Open ProPrint Assistant'}>
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        <span className="hidden sm:inline">Ask ProPrint</span>
      </button>
    </div>
  );
}
