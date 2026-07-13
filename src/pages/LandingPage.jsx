import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, MapPin, QrCode, Gift, BarChart3, Truck, ArrowRight, ChevronDown, CheckCircle2, Recycle, Users, Store, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getRoleHome } from "../utils/roles";

const faqs = [
  {
    question: "Como funciona o sistema de pontos?",
    answer: "Cada tipo de resíduo possui uma pontuação específica por kg. Ao entregar seus materiais em um de nossos pontos parceiros, o volume é pesado, validado e os pontos são creditados automaticamente na sua carteira digital."
  },
  {
    question: "O que eu posso fazer com os pontos?",
    answer: "Você pode trocar seus pontos por vouchers de desconto, produtos exclusivos, ingressos para eventos ou até mesmo doá-los para instituições de caridade cadastradas na plataforma."
  },
  {
    question: "Como encontro um ponto de coleta?",
    answer: "Após fazer o login, você terá acesso ao nosso mapa interativo onde poderá filtrar pontos de coleta por proximidade e pelo tipo de resíduo que eles aceitam."
  },
  {
    question: "Minha empresa quer ser um ponto de coleta. É possível?",
    answer: "Sim! Qualquer estabelecimento comercial pode se cadastrar como Ponto de Coleta. Oferecemos um dashboard exclusivo para gerenciar o volume recebido e atrair mais fluxo para sua loja."
  }
];

const features = [
  {
    title: "Para Moradores",
    description: "Descarte consciente com recompensas. Localize pontos no mapa, valide suas entregas via QR Code e acumule pontos na hora.",
    icon: Users,
    color: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50",
    iconColor: "text-emerald-600",
    benefits: ["Carteira digital de pontos", "Mapa interativo", "Catálogo de prêmios"]
  },
  {
    title: "Para Pontos de Coleta",
    description: "Atraia clientes e controle estoques. Use nosso painel para validar entregas de moradores rapidamente via QR Code.",
    icon: Store,
    color: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    iconColor: "text-blue-600",
    benefits: ["Validação expressa", "Controle de inventário", "Mais fluxo de pessoas"]
  },
  {
    title: "Para Cooperativas",
    description: "Gestão completa da cadeia. Monitore os volumes disponíveis nos pontos de coleta e otimize rotas de caminhões.",
    icon: Truck,
    color: "from-amber-500 to-amber-600",
    bgLight: "bg-amber-50",
    iconColor: "text-amber-600",
    benefits: ["Dashboard operacional", "Gestão de motoristas", "Previsibilidade de volume"]
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getRoleHome(user.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Navbar Completa */}
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 shadow-sm backdrop-blur-md py-3" : "bg-transparent py-5"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Residuum Logo" className="h-10 w-auto rounded-lg object-contain mix-blend-multiply" />
            <span className="text-2xl font-black tracking-tight text-emerald-900">Residuum</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <button onClick={() => scrollTo("servicos")} className="hover:text-emerald-600 transition-colors">Soluções</button>
            <button onClick={() => scrollTo("como-funciona")} className="hover:text-emerald-600 transition-colors">Como funciona</button>
            <button onClick={() => scrollTo("faq")} className="hover:text-emerald-600 transition-colors">Dúvidas</button>
            <button 
              onClick={() => navigate("/welcome")}
              className="ml-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 hover:-translate-y-0.5"
            >
              Entrar na Plataforma
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl py-4 px-6 md:hidden flex flex-col gap-4">
            <button onClick={() => scrollTo("servicos")} className="text-left py-2 font-medium text-slate-600">Soluções</button>
            <button onClick={() => scrollTo("como-funciona")} className="text-left py-2 font-medium text-slate-600">Como funciona</button>
            <button onClick={() => scrollTo("faq")} className="text-left py-2 font-medium text-slate-600">Dúvidas</button>
            <button onClick={() => navigate("/welcome")} className="mt-2 w-full rounded-xl bg-emerald-600 py-3 text-center font-bold text-white">
              Entrar na Plataforma
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/50 via-white to-white"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-sm mb-6 border border-emerald-200">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                A revolução da reciclagem
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                Seu descarte correto vale <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">benefícios reais.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                O Residuum é a plataforma que conecta quem quer descartar com quem precisa coletar. Moradores ganham pontos, pontos de coleta atraem público e cooperativas ganham eficiência logística.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate("/welcome")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-200 transition-all hover:bg-emerald-700 hover:-translate-y-1"
                >
                  Começar a reciclar <ArrowRight size={20} />
                </button>
                <button 
                  onClick={() => scrollTo("como-funciona")}
                  className="inline-flex items-center justify-center rounded-full bg-white border-2 border-slate-200 px-8 py-4 text-lg font-bold text-slate-700 transition-all hover:border-emerald-600 hover:text-emerald-700"
                >
                  Entenda o fluxo
                </button>
              </div>
            </div>
            <div className="relative lg:ml-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100 to-teal-100 blur-2xl rounded-full opacity-50"></div>
              <img src="/2-people.png" alt="Pessoas reciclando" className="relative w-full max-w-lg mx-auto rounded-3xl shadow-2xl object-cover transform transition-transform hover:scale-[1.02] duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Demonstrações Visuais - Seções Completas */}
      <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Conheça a plataforma por dentro</h2>
            <p className="text-xl text-slate-600">Explore as interfaces que tornam o Residuum a melhor experiência em reciclagem.</p>
          </div>

          <div className="space-y-24 lg:space-y-32">
            
            {/* Feature 1: Dashboard */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm">
                  <User size={16} /> Para Moradores
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-[#1F4E79] leading-tight">
                  Seu progresso na palma da mão
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Acompanhe em tempo real o saldo da sua carteira digital, veja o histórico das suas últimas entregas e descubra quanto impacto positivo você já gerou para o planeta.
                </p>
                <ul className="space-y-3 pt-4">
                  <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-emerald-500" size={20} /> Saldo de pontos atualizado na hora</li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-emerald-500" size={20} /> Extrato transparente de descartes</li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-emerald-500" size={20} /> Metas e impacto ambiental</li>
                </ul>
              </div>
              <div className="flex-1 w-full max-w-lg mx-auto">
                <div className="relative rounded-[2rem] border-[10px] border-slate-800 bg-[#f8fafc] shadow-2xl overflow-hidden aspect-[4/5] sm:aspect-square flex flex-col p-4 transform transition-transform hover:-translate-y-2">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-4 flex flex-col gap-3">
                    <div>
                      <h4 className="text-lg font-extrabold text-[#1F4E79]">Bem-vindo(a), João! 👋</h4>
                      <p className="text-xs text-slate-500">Resumo da sua jornada sustentável.</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white border-2 border-slate-200 rounded-lg py-2 text-center text-xs font-bold text-slate-700 flex items-center justify-center gap-1"><MapPin size={14}/> Mapa</div>
                      <div className="flex-1 bg-emerald-600 text-white rounded-lg py-2 text-center text-xs font-bold flex items-center justify-center gap-1"><Recycle size={14}/> Reciclar</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#1F4E79] flex items-center justify-center mb-2"><BarChart3 size={16} /></div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Pontuação Total</p>
                      <h5 className="text-xl font-black text-[#1F4E79]">1.250</h5>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#1F4E79] flex items-center justify-center mb-2"><Store size={16} /></div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Estoque (kg)</p>
                      <h5 className="text-xl font-black text-[#1F4E79]">12.5 <span className="text-xs text-slate-400">kg</span></h5>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col">
                    <h5 className="font-bold text-[#1F4E79] text-sm mb-3">Suas entregas este ano</h5>
                    <div className="flex-1 flex items-end gap-2 justify-between mt-auto">
                      {[30, 45, 20, 60, 80, 50].map((h, i) => (
                        <div key={i} className="w-full bg-[#1F4E79] rounded-t-sm" style={{ height: `${h}%` }}></div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold">
                      <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Map */}
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 w-full max-w-lg mx-auto">
                <div className="relative rounded-[2rem] border-[10px] border-slate-800 bg-slate-100 shadow-2xl overflow-hidden aspect-[4/5] sm:aspect-square flex flex-col transform transition-transform hover:-translate-y-2">
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#94A3B8 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
                  <div className="relative z-10 flex-1 flex flex-col p-4">
                    {/* Search bar */}
                    <div className="bg-white p-4 rounded-2xl shadow-md flex items-center gap-3 mb-auto">
                      <MapPin className="text-emerald-500" size={20} />
                      <div className="flex-1">
                        <p className="text-xs text-slate-400">Buscando perto de</p>
                        <p className="font-bold text-[#1F4E79] text-sm">Sua localização atual</p>
                      </div>
                    </div>
                    {/* Pins on map */}
                    <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 animate-pulse">
                        <Store size={24} />
                      </div>
                    </div>
                    <div className="absolute top-1/3 right-1/4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-md">
                        <Store size={18} />
                      </div>
                    </div>
                    {/* Bottom Sheet */}
                    <div className="bg-white p-5 rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] mt-auto">
                      <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4"></div>
                      <h4 className="text-lg font-black text-[#1F4E79] mb-1">EcoPonto Central</h4>
                      <p className="text-sm text-slate-500 mb-4">A 1.2 km de distância • Aberto agora</p>
                      <div className="flex gap-2 mb-4">
                        <span className="px-3 py-1 bg-slate-100 text-[#1F4E79] rounded-md text-xs font-bold">Vidro</span>
                        <span className="px-3 py-1 bg-slate-100 text-[#1F4E79] rounded-md text-xs font-bold">Papel</span>
                        <span className="px-3 py-1 bg-slate-100 text-[#1F4E79] rounded-md text-xs font-bold">Plástico</span>
                      </div>
                      <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold">
                        Como chegar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-sm">
                  <MapPin size={16} /> Mapa Inteligente
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-[#1F4E79] leading-tight">
                  Encontre o ponto de coleta ideal
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Não sabe onde descartar o óleo de cozinha ou aquele vidro quebrado? Nosso mapa mostra os pontos de coleta mais próximos e filtra pelo material que você precisa descartar.
                </p>
                <ul className="space-y-3 pt-4">
                  <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-blue-500" size={20} /> Filtros por tipo de resíduo</li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-blue-500" size={20} /> Informações de horário de funcionamento</li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-blue-500" size={20} /> Roteamento e distância exata</li>
                </ul>
              </div>
            </div>

            {/* Feature 3: Sorteios/Recompensas */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-bold text-sm">
                  <Gift size={16} /> Recompensas
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-[#1F4E79] leading-tight">
                  Prêmios que fazem valer a pena
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  O Residuum transforma seu esforço ambiental em benefícios reais. Use seus pontos acumulados para resgatar produtos na loja ou comprar bilhetes para os grandes sorteios mensais.
                </p>
                <ul className="space-y-3 pt-4">
                  <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-orange-500" size={20} /> Sorteios de alto valor (Bicicletas, Smartphones)</li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-orange-500" size={20} /> Resgate imediato de vouchers e descontos</li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-orange-500" size={20} /> Sistema de tickets digital e seguro</li>
                </ul>
              </div>
              <div className="flex-1 w-full max-w-lg mx-auto">
                <div className="relative rounded-[2rem] border-[10px] border-slate-800 bg-[#f8fafc] shadow-2xl overflow-hidden aspect-[4/5] sm:aspect-square flex flex-col p-4 transform transition-transform hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-4 pt-2">
                    <h4 className="font-extrabold text-2xl text-[#1F4E79]">Sorteios</h4>
                  </div>
                  
                  <div className="space-y-4 overflow-y-hidden">
                    {/* Sorteio Card Igual a UI */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                      <div className="flex gap-3">
                        <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm">
                          <Gift size={26} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-extrabold text-[#1F4E79] text-base truncate">Bicicleta Caloi</h3>
                          <p className="text-sm font-semibold text-slate-500 mt-1">EcoCorp Brasil</p>
                          <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-1.5"><Gift size={14}/> 500 pts</span>
                            <span className="flex items-center gap-1.5"><Users size={14}/> 120</span>
                            <span className="flex items-center gap-1.5 col-span-2"><Menu size={14}/> até 30/11/2026</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button className="w-full py-3 border-2 border-emerald-600 text-emerald-600 font-bold rounded-full text-sm">
                          Ver detalhes
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm opacity-60">
                      <div className="flex gap-3">
                        <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm">
                          <Gift size={26} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-extrabold text-[#1F4E79] text-base truncate">Cupom Ifood R$50</h3>
                          <p className="text-sm font-semibold text-slate-500 mt-1">Ifood</p>
                          <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-1.5"><Gift size={14}/> 800 pts</span>
                            <span className="flex items-center gap-1.5"><Users size={14}/> 45</span>
                            <span className="flex items-center gap-1.5 col-span-2"><Menu size={14}/> até 15/12/2026</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Demonstração dos Serviços */}
      <section id="servicos" className="py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Um ecossistema completo</h2>
            <p className="text-xl text-slate-600">Desenvolvemos ferramentas específicas para cada elo da cadeia de reciclagem.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group relative bg-white border border-slate-200 rounded-3xl p-8 transition-all duration-300 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50 overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.bgLight} ${feature.iconColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon size={28} strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight">{feature.title}</h3>
                </div>
                
                <p className="text-slate-600 mb-8 leading-relaxed">{feature.description}</p>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Principais Vantagens</h4>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <CheckCircle2 size={18} className={feature.iconColor} /> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/30 via-slate-900 to-slate-900"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Como funciona na prática?</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Um processo desenhado para ser rápido, sem atrito e totalmente transparente.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0"></div>
            {[
              { title: "Cadastre-se", icon: MapPin, text: "Crie sua conta como morador, ponto ou cooperativa." },
              { title: "Agrupe", icon: Recycle, text: "Separe os resíduos e gere um código no app." },
              { title: "Entregue", icon: QrCode, text: "O ponto lê seu QR Code e valida a pesagem." },
              { title: "Fature", icon: Gift, text: "Os pontos caem na conta na mesma hora!" }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <step.icon size={36} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Passo {i + 1}: {step.title}</h3>
                <p className="text-slate-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Call to Action - Pontos de Coleta */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-900"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-sm mb-6">
                <Store size={16} /> Para Estabelecimentos
              </div>
              <h2 className="text-4xl font-black mb-6 leading-tight">
                Transforme sua loja em um <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Ponto de Coleta</span> e atraia mais clientes.
              </h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Ao se cadastrar no Residuum, seu estabelecimento entra no nosso mapa interativo. Moradores vão até você para entregar materiais recicláveis, gerando fluxo diário de pessoas na sua porta sem custo com marketing.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0"><Users size={24}/></div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Aumento de Fluxo</h4>
                    <p className="text-sm text-slate-400">Pessoas visitam sua loja toda semana para descartar resíduos.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0"><MapPin size={24}/></div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Visibilidade Local</h4>
                    <p className="text-sm text-slate-400">Sua marca em destaque no nosso mapa para toda a região.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate("/cadastro-ponto-coleta")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:-translate-y-1"
              >
                Quero cadastrar minha loja <ArrowRight size={20} />
              </button>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 relative shadow-2xl">
                <div className="flex justify-between items-start mb-6 border-b border-slate-700 pb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white">Painel do Lojista</h3>
                    <p className="text-slate-400 text-sm mt-1">Validação rápida em 3 segundos.</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                    <QrCode className="text-slate-300" size={24} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-700/50 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-slate-300">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">Maria Oliveira quer descartar:</p>
                        <p className="text-xs text-emerald-400 font-bold mt-1">2.5 kg de Plástico</p>
                      </div>
                    </div>
                    <button className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg">Aprovar</button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-700">
                      <p className="text-xs text-slate-400 font-bold mb-1 uppercase">Pessoas na loja hoje</p>
                      <h4 className="text-2xl font-black text-white">42</h4>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-700">
                      <p className="text-xs text-slate-400 font-bold mb-1 uppercase">Volume Recebido</p>
                      <h4 className="text-2xl font-black text-white">105 kg</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">Perguntas Frequentes</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300">
                <button 
                  className="w-full px-6 py-5 text-left flex justify-between items-center font-bold text-slate-800 focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  {faq.question}
                  <ChevronDown className={`transform transition-transform ${openFaq === idx ? "rotate-180 text-emerald-600" : "text-slate-400"}`} />
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === idx ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0djIwaC0ydi0yMGgtMjB2LTJoMjB2LTIwaDJ2MjBoMjB2MnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        <div className="relative mx-auto max-w-4xl px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Pronto para gerar impacto?</h2>
          <p className="text-xl md:text-2xl text-emerald-100 mb-10 font-medium">Cadastre-se na Residuum e faça parte da maior rede de reciclagem gamificada do Brasil.</p>
          <button 
            onClick={() => navigate("/welcome")}
            className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-5 text-xl font-black text-emerald-700 shadow-2xl transition-transform hover:scale-105"
          >
            Criar minha conta agora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Residuum Logo" className="h-8 w-auto mix-blend-multiply opacity-80" />
            <span className="text-xl font-bold text-slate-800">Residuum</span>
          </div>
          <div className="flex gap-6 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-emerald-600 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Contato</a>
          </div>
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Residuum LTDA.
          </p>
        </div>
      </footer>
    </div>
  );
}
