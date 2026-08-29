'use client';

import Link from 'next/link';
import { Bot, ChevronRight, Headphones, MessageCircle, Send, UserRoundCheck, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

type Reply = {
  text: string;
  href?: string;
  actionLabel?: string;
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
  const recentUserContext = history
    .filter((message) => message.role === 'user')
    .slice(-8)
    .map((message) => message.text.toLowerCase())
    .join(' ');
  const context = `${recentUserContext} ${text}`;

  const priceQuestion = /(how much|price|cost|charge|charges|quotation|quote)/.test(text);
  const etaQuestion = /(eta|how long|time|when|days|ready|finish|complete)/.test(text);
  const brandOnly = /^(hp|dell|lenovo|asus|acer|msi|apple|canon|epson|brother|xerox|ricoh|kyocera)$/i.test(input.trim());

  const laptopContext = /(laptop|notebook|desktop|pc|workstation|hp|dell|lenovo|asus|acer|msi|apple|macbook)/.test(context);
  const printerContext = /(printer|laserjet|officejet|deskjet|inkjet|mfp|multifunction|canon|epson|brother|xerox|ricoh|kyocera)/.test(context);
  const plotterContext = /(plotter|designjet|surecolor|large format|wide format)/.test(context);

  const screenContext = /(lcd|screen|display|panel|cracked|broken screen)/.test(context);
  const storageContext = /(ssd|hard disk|hard drive|hdd|nvme|storage|disk)/.test(context);
  const ramContext = /(ram|memory|upgrade memory)/.test(context);
  const powerContext = /(not powering|no power|dead|charging|charger|dc jack|adapter|battery)/.test(context);
  const keyboardContext = /(keyboard|keys|touchpad|trackpad)/.test(context);
  const hingeContext = /(hinge|body|casing|cover|bezel)/.test(context);
  const overheatingContext = /(heat|heating|overheat|fan|thermal|shutdown)/.test(context);

  const paperJam = /(paper jam|jammed|paper stuck|does not feed|not feeding|feed issue|pickup)/.test(context);
  const printQuality = /(line|lines|streak|faded|fading|blur|smudge|print quality|blank page|colour issue|color issue)/.test(context);
  const tonerInk = /(toner|cartridge|ink|ink system|ink error)/.test(context);
  const printerError = /(error code|service error|firmware|offline|not detected|not printing|won't print|wont print)/.test(context);
  const printerHardware = /(fuser|formatter|mainboard|board|roller|pickup roller|scanner|adf|duplex|motor)/.test(context);

  const plotterMedia = /(media|paper|roll|roll feed|sheet feed|cutter|cutting|carriage|belt)/.test(context);
  const plotterPrinthead = /(printhead|print head|nozzle|ink system|maintenance cartridge)/.test(context);

  if (/(outside kuwait|saudi|dubai|uae|qatar|bahrain|oman|india|uk|international|overseas)/.test(text)) {
    return {
      text: 'This ProPrint website assistant is currently configured for Kuwait enquiries only. For requirements outside Kuwait, please contact ProPrint directly before assuming delivery or service coverage.',
      href: '/contact',
      actionLabel: 'Contact ProPrint',
    };
  }

  if (/^(laptop|desktop|laptop repair|desktop repair|laptop \/ desktop repair)$/i.test(input.trim())) {
    return {
      text: 'Yes. ProPrint can accept laptop and desktop repair or upgrade requests in Kuwait. Which brand and model do you have? For example HP, Dell, Lenovo, ASUS, Acer or MSI. Also tell me what is not working or what you want to upgrade.',
      href: '/service',
      actionLabel: 'Open Service Request',
    };
  }

  if (brandOnly && laptopContext && !printerContext && !plotterContext) {
    return {
      text: `Understood — ${input.trim()} computer. Please tell me the exact model if you know it, and what is wrong or what upgrade you need. Common requests include LCD replacement, SSD or HDD replacement, HDD-to-SSD upgrade, RAM upgrade, battery, charging jack, keyboard, hinge/body repair, overheating, no power and Windows or storage problems.`,
      href: '/service',
      actionLabel: 'Submit Computer Details',
    };
  }

  if (laptopContext && storageContext) {
    if (priceQuestion) {
      return {
        text: 'Yes, ProPrint can handle storage replacements and upgrades such as failed HDD replacement, SSD replacement, NVMe SSD upgrades and HDD-to-SSD conversion. The final price depends on the required SSD/HDD type and capacity, compatibility with the exact model, data migration requirements and current vendor price. ProPrint can confirm labour/service charges first, then provide the full quotation after the correct part is identified.',
        href: '/service',
        actionLabel: 'Request Storage Upgrade Quote',
      };
    }
    return {
      text: 'Yes. We can receive requests for SSD replacement, hard-disk replacement, NVMe SSD installation and HDD-to-SSD upgrades. Please tell me the computer brand/model, current storage if known, the capacity you want such as 500GB, 1TB or 2TB, and whether you need the old data cloned or transferred.',
      href: '/service',
      actionLabel: 'Submit Storage Upgrade',
    };
  }

  if (laptopContext && ramContext) {
    return {
      text: 'Yes. ProPrint can receive RAM upgrade requests. Please provide the laptop or desktop brand and exact model, current RAM if known, and the target memory you want such as 16GB or 32GB. Compatibility, available slots and maximum supported RAM must be checked before the final part quotation and ETA are confirmed.',
      href: '/service',
      actionLabel: 'Request RAM Upgrade',
    };
  }

  if (laptopContext && screenContext && priceQuestion) {
    return {
      text: 'Yes. ProPrint can accept laptop LCD/display replacement requests. The labour or service charge can be advised according to ProPrint’s approved rate, but the full quotation depends on the exact laptop model, screen specification and vendor part price. Once the correct LCD and stock are confirmed, ProPrint can provide the final quotation and ETA. Please provide the exact model or product number.',
      href: '/service',
      actionLabel: 'Submit Laptop Model',
    };
  }

  if (laptopContext && screenContext) {
    return {
      text: 'Yes, we can receive laptop LCD/display repair or replacement requests. Is the screen cracked, completely blank, flickering, showing lines, very dim, or physically damaged? Please also provide the laptop brand and exact model/product number so the correct panel can be identified.',
      href: '/service',
      actionLabel: 'Request LCD Service',
    };
  }

  if (laptopContext && powerContext) {
    return {
      text: 'For a laptop or desktop power issue, please tell me whether it has no power at all, powers on but does not boot, only works on the charger, does not charge the battery, or has a loose/broken charging socket. Please include the brand and exact model so the service team can diagnose the correct area.',
      href: '/service',
      actionLabel: 'Submit Power Fault',
    };
  }

  if (laptopContext && keyboardContext) {
    return {
      text: 'Yes. ProPrint can receive keyboard and touchpad repair/replacement requests. Please tell me whether individual keys have failed, the whole keyboard is not detected, liquid was spilled, the touchpad is faulty, or there is physical damage. The exact brand/model is required for part pricing and ETA.',
      href: '/service',
      actionLabel: 'Submit Keyboard Fault',
    };
  }

  if (laptopContext && hingeContext) {
    return {
      text: 'Yes. Hinge, bezel and laptop body/casing damage can be reviewed. Please tell me whether the hinge is loose, broken from the body, the screen back cover is cracked, or the bezel/base is damaged. Photos plus the exact model are useful because the repair may need a hinge set, cover, palm-rest or multiple parts.',
      href: '/service',
      actionLabel: 'Submit Physical Damage',
    };
  }

  if (laptopContext && overheatingContext) {
    return {
      text: 'Yes. For overheating, fan noise or thermal shutdown, ProPrint can inspect cooling fans, vents, heatsink condition and thermal compound. Please tell me whether the unit becomes hot, shuts down, shows a fan error, or runs very slowly, and provide the exact brand/model.',
      href: '/service',
      actionLabel: 'Request Thermal Service',
    };
  }

  if (laptopContext && etaQuestion) {
    return {
      text: 'Computer repair ETA depends on diagnosis, exact model, required spare part and vendor availability. If the part is locally available the job can usually be scheduled sooner; special-order parts take longer. ProPrint should give a confirmed ETA only after the correct part and stock are checked.',
      href: '/service',
      actionLabel: 'Submit Computer Details',
    };
  }

  if (/(do you repair|can you repair|repair hp|repair dell|repair lenovo|laptop repair|desktop repair|computer repair)/.test(context)) {
    return {
      text: 'Yes. ProPrint can accept laptop and desktop repair requests in Kuwait. Which brand/model do you have, and what is the problem? We can receive requests covering LCD/display, SSD/HDD, RAM upgrades, battery/charging, keyboard, hinges/body, overheating, no-power faults and general hardware diagnostics.',
      href: '/service',
      actionLabel: 'Start Computer Service Request',
    };
  }

  if (/^(printer|printer repair)$/i.test(input.trim())) {
    return {
      text: 'Yes. ProPrint can accept printer repair requests in Kuwait. Which brand and model is the printer? For example HP, Canon, Epson, Brother, Xerox, Ricoh or Kyocera. Then tell me the symptom: paper jam, not feeding paper, not printing, error code, poor print quality, toner/ink issue, scanner/ADF issue, duplex problem, noise or another fault.',
      href: '/service',
      actionLabel: 'Open Printer Service Request',
    };
  }

  if (printerContext && paperJam) {
    return {
      text: 'For a paper-jam or paper-feed problem, please tell me the printer brand/model and where the paper stops if you can see it: input tray, inside the printer, duplex section or output area. Also tell me whether it jams every page or only occasionally. The cause may be paper path debris, pickup/separation rollers, sensors, duplex components or another mechanical issue and must be diagnosed before parts are quoted.',
      href: '/service',
      actionLabel: 'Submit Paper Feed Fault',
    };
  }

  if (printerContext && printQuality) {
    return {
      text: 'For print-quality problems, please tell me the brand/model and what you see: faded print, vertical or horizontal lines, streaks, smudging, missing colours, blank pages, repeated marks or uneven density. The cause can vary between toner/ink, drum/imaging components, printhead, fuser or other parts, so the service team should diagnose before quoting replacement parts.',
      href: '/service',
      actionLabel: 'Submit Print Quality Issue',
    };
  }

  if (printerContext && tonerInk) {
    return {
      text: 'Yes. ProPrint can review toner, cartridge and ink-system issues. Please provide the printer brand/model, the exact error message if any, and whether you are using toner, cartridge bottles or an ink-tank system. Consumable replacement and hardware faults are different, so the exact model and symptom are needed before pricing.',
      href: '/service',
      actionLabel: 'Submit Toner / Ink Issue',
    };
  }

  if (printerContext && printerHardware) {
    return {
      text: 'Yes. Printer hardware faults such as fuser, rollers, formatter/mainboard, scanner, ADF, duplex or motor-related issues can be assessed. Please send the exact printer model and fault/error. The final repair quotation and ETA depend on diagnosis and vendor availability of the required spare part.',
      href: '/service',
      actionLabel: 'Submit Printer Hardware Fault',
    };
  }

  if (printerContext && printerError) {
    return {
      text: 'Please provide the printer brand/model and the exact error code or message shown on the display/computer. If it simply does not print, tell me whether it is connected by USB, network/Wi-Fi, or shows Offline. This helps separate a configuration issue from a hardware fault.',
      href: '/service',
      actionLabel: 'Submit Printer Error',
    };
  }

  if (printerContext && priceQuestion) {
    return {
      text: 'Printer repair pricing depends on the model and diagnosed fault. ProPrint can advise the applicable service/diagnostic charge, but if a fuser, roller kit, formatter, printhead, scanner unit or other spare part is required, the complete quotation must include the current vendor part price. ETA is confirmed after the required part and availability are checked.',
      href: '/service',
      actionLabel: 'Request Printer Quote',
    };
  }

  if (printerContext && etaQuestion) {
    return {
      text: 'Printer repair ETA depends on diagnosis and spare-part availability. Simple service or configuration work may be completed sooner, while jobs requiring a fuser, formatter, printhead, roller kit or other ordered part can take longer. ProPrint should confirm ETA after checking the model and part stock.',
      href: '/service',
      actionLabel: 'Submit Printer Details',
    };
  }

  if (/^(plotter|plotter repair)$/i.test(input.trim())) {
    return {
      text: 'Yes. ProPrint can accept plotter and large-format printer repair requests in Kuwait. Which brand and model do you have, such as HP DesignJet, Canon imagePROGRAF or Epson SureColor? Then tell me the symptom: printhead/ink error, carriage fault, belt issue, media/roll feed problem, cutter problem, poor print quality, error code, paper jam or another fault.',
      href: '/service',
      actionLabel: 'Open Plotter Service Request',
    };
  }

  if (plotterContext && plotterPrinthead) {
    return {
      text: 'For plotter printhead, nozzle, ink-system or maintenance-cartridge issues, please provide the exact plotter model and any error code. Tell me whether colours are missing, nozzles are blocked, the unit rejects a printhead/ink component, or there is an ink-system warning. Parts vary significantly by model, so the final quotation and ETA require vendor price and stock confirmation.',
      href: '/service',
      actionLabel: 'Submit Plotter Ink-System Fault',
    };
  }

  if (plotterContext && plotterMedia) {
    return {
      text: 'For roll-feed, media, carriage, belt or cutter problems, please provide the exact plotter model and describe what happens: media not loading, skewing, carriage not moving, belt damaged, cutter not cutting, or paper jamming. These faults may require mechanical diagnosis and model-specific spare parts before a final quotation and ETA can be given.',
      href: '/service',
      actionLabel: 'Submit Plotter Mechanical Fault',
    };
  }

  if (plotterContext && printQuality) {
    return {
      text: 'For plotter print-quality issues, please tell me the exact model and whether you see banding, missing colours, lines, faded output, alignment problems or smudging. The cause can involve printheads, ink system, calibration, media settings or mechanical issues. Diagnosis comes first, then ProPrint can quote any required parts.',
      href: '/service',
      actionLabel: 'Submit Plotter Print Issue',
    };
  }

  if (plotterContext && priceQuestion) {
    return {
      text: 'Plotter repair pricing depends heavily on the exact model and diagnosed fault. ProPrint can advise the service/diagnostic charge, while printheads, belts, carriage assemblies, cutters, ink-system parts and other spares require current vendor pricing. The complete quotation and ETA are confirmed once the required part and stock are known.',
      href: '/service',
      actionLabel: 'Request Plotter Quote',
    };
  }

  if (plotterContext && etaQuestion) {
    return {
      text: 'Plotter ETA depends on diagnosis and model-specific spare-part availability. ProPrint should confirm the expected completion time after identifying the required part and checking local or vendor stock rather than promising an inaccurate date.',
      href: '/service',
      actionLabel: 'Submit Plotter Details',
    };
  }

  if (/(do you repair printers|repair printer|printer service)/.test(context)) {
    return {
      text: 'Yes. ProPrint can accept printer service requests. Please tell me the printer brand/model and what is wrong: paper jam/feed issue, print quality, toner/ink, error code, scanner/ADF, duplex, fuser/roller, not printing or another fault.',
      href: '/service',
      actionLabel: 'Start Printer Service Request',
    };
  }

  if (/(do you repair plotters|repair plotter|plotter service|large format repair)/.test(context)) {
    return {
      text: 'Yes. ProPrint can accept plotter and large-format printer service requests in Kuwait. Please provide the brand/model and symptom, such as printhead/ink-system fault, media feed, carriage/belt, cutter, print quality, error code or paper jam.',
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
    text: 'I can help with product enquiries, laptop/desktop repair and upgrades, printer repair, plotter repair, AMC, enterprise IT and quotations in Kuwait. For service requests, tell me the equipment brand/model and the symptom or upgrade you need. I will keep the recent conversation in context and will not invent part prices or repair ETAs.',
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
      text: 'Hello! I’m the ProPrint Assistant for Kuwait. I can help with products, laptop/desktop repairs and upgrades, printer and plotter repairs, AMC, enterprise IT and quotations. Tell me the equipment brand/model and what is wrong, or choose a quick option below.',
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
