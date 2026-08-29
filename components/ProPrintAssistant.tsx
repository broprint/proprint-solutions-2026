'use client';

import Link from 'next/link';
import { Bot, ChevronRight, Headphones, MessageCircle, Send, X } from 'lucide-react';
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

const QUICK_ACTIONS = [
  'Buy a Product',
  'Printer / Plotter Repair',
  'Laptop / Desktop Repair',
  'AMC Support',
  'Enterprise IT',
  'Request a Quote',
];

function getReply(input: string): Reply {
  const text = input.toLowerCase();

  if (/(price|stock|availability|available|buy|product|printer|plotter|laptop|desktop|monitor|network|server|storage)/.test(text) && !/(repair|service|fix|broken|fault)/.test(text)) {
    return {
      text: 'I can help you browse ProPrint products for Kuwait. Website prices and availability are currently indicative for the management demo, so final stock and commercial pricing should be confirmed by ProPrint.',
      href: '/shop',
      actionLabel: 'Browse Products',
    };
  }

  if (/(repair|service|fix|broken|fault|printer repair|plotter repair|laptop repair|desktop repair)/.test(text)) {
    return {
      text: 'ProPrint can receive service requests for printers, plotters, laptops, desktops and related equipment in Kuwait. Submit the equipment/model and issue so the service team can review it.',
      href: '/service',
      actionLabel: 'Start Service Request',
    };
  }

  if (/(amc|annual maintenance|maintenance contract)/.test(text)) {
    return {
      text: 'For Kuwait businesses, ProPrint can discuss AMC coverage for IT and printing environments. The exact scope, asset count and service terms are confirmed through a business quotation.',
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

  if (/(outside kuwait|saudi|dubai|uae|qatar|bahrain|oman|india|uk|international|overseas)/.test(text)) {
    return {
      text: 'This ProPrint website assistant is currently configured for Kuwait enquiries only. For any requirement outside Kuwait, please contact ProPrint directly before assuming delivery or service coverage.',
      href: '/contact',
      actionLabel: 'Contact ProPrint',
    };
  }

  return {
    text: 'I can help with ProPrint products, repairs, AMC, enterprise IT and quotations in Kuwait. I will not guess live stock, final prices, repair times or service availability. Choose an option below or tell me what you need.',
  };
}

export function ProPrintAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello! I’m the ProPrint Assistant. I can help with products, repairs, AMC, enterprise IT and quotations for customers in Kuwait.',
    },
  ]);

  const lastReply = useMemo(() => [...messages].reverse().find((m) => m.reply)?.reply, [messages]);

  function ask(text: string) {
    const clean = text.trim();
    if (!clean) return;
    const reply = getReply(clean);
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

  return (
    <div className="fixed bottom-4 right-4 z-[70] sm:bottom-6 sm:right-6">
      {open && (
        <section className="mb-3 flex h-[min(650px,78vh)] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-2xl shadow-slate-950/20" aria-label="ProPrint Assistant">
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
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            {lastReply?.href && <p className="mb-2 px-1 text-[10px] text-slate-400">For confirmed pricing, stock, response times or coverage, submit a ProPrint request.</p>}
            <form onSubmit={submit} className="flex items-center gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about products or support..." aria-label="Message ProPrint Assistant" className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#0b5cff]" />
              <button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f47b20] text-white" aria-label="Send message"><Send size={17} /></button>
            </form>
            <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-slate-400"><Headphones size={11} /> Guided website assistant • Kuwait only</div>
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
