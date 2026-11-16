/* Tornare a me — 14 giorni. Contenuti del percorso.
   Giorni 1-7: dal workbook originale di Viola. Giorni 8-14: BOZZA da far approvare a Viola. */
window.TAM_WEEKS = [
  { n: 1, title: "Tornare a me", sub: "Fermarmi, ascoltarmi, capire dove sono." },
  { n: 2, title: "Scegliermi", sub: "Trasformare quello che ho capito in gesti concreti." }
];

window.TAM_DAYS = [
  {
    n: 1, title: "Guardarmi",
    sub: "Prima di cambiare qualcosa, devo capire dove sono.",
    intro: "Siamo spesso così impegnate a gestire la quotidianità che raramente ci fermiamo a osservare come stiamo davvero. Possiamo avere una casa, un lavoro, una famiglia, impegni e responsabilità. Eppure sentire che qualcosa dentro di noi chiede attenzione. Non significa essere ingrata per quello che abbiamo. Significa riconoscere che anche i nostri bisogni contano.",
    q: [
      "Se dovessi descrivere questo momento della mia vita con tre parole, quali sceglierei?",
      "Qual è la cosa che ultimamente occupa maggiormente i miei pensieri?",
      "In quale parte della mia vita sento di avere meno spazio per me?"
    ],
    prompt: "In questo momento, quello che vorrei riuscire a dire è:",
    step: "Ritagliati dieci minuti senza telefono, impegni o richieste degli altri. Non devi risolvere niente. Ascoltati.",
    remember: "Riconoscere come sto è già un modo per prendermi sul serio."
  },
  {
    n: 2, title: "Ritrovarmi",
    sub: "In quali momenti ho smesso di ascoltarmi?",
    intro: "A volte non perdiamo noi stesse in un unico grande momento. Succede lentamente. Una volta rinunciamo a qualcosa perché sembra più importante altro. Un'altra volta tacciamo per evitare una discussione. Rimandiamo un progetto, un'uscita, un desiderio. Non serve giudicare le scelte che abbiamo fatto. Oggi possiamo guardarle con maggiore consapevolezza.",
    q: [
      "Quale desiderio personale ho rimandato più a lungo?",
      "In quale situazione mi capita di dire di sì quando vorrei dire di no?",
      "Che cosa facevo un tempo che mi faceva sentire bene e che oggi non trova più spazio?"
    ],
    prompt: "Una parte di me che vorrei ritrovare è:",
    step: "Riprendi una piccola attività che ti piaceva: una passeggiata, leggere, ascoltare musica o prenderti cura di qualcosa. Non deve essere utile agli altri. Deve fare bene a te.",
    remember: "Posso riconoscere ciò che ho trascurato senza rimproverarmi per il passato."
  },
  {
    n: 3, title: "Riconoscere il mio valore",
    sub: "Il mio valore non dipende da quanto riesco a essere importante per gli altri.",
    intro: "Nelle relazioni desideriamo essere amate, cercate, ascoltate e considerate. È umano. Ma quando iniziamo a misurare il nostro valore attraverso le attenzioni di un'altra persona, possiamo finire per mettere da parte ciò che sentiamo e ciò di cui abbiamo bisogno. Oggi proviamo a spostare lo sguardo.",
    q: [
      "In quale situazione aspetto spesso la conferma di qualcun altro per sentirmi importante?",
      "Che cosa riconosco di positivo in me, indipendentemente da ciò che pensano gli altri?",
      "Quale trattamento desidero ricevere e quale, invece, non voglio più considerare normale?"
    ],
    prompt: "Una cosa che apprezzo di me è:",
    step: "Scrivi tre qualità che riconosci in te. Possono essere la sensibilità, la determinazione, la capacità di ascoltare o la creatività. Rileggile senza sminuirle.",
    remember: "Posso desiderare di essere amata senza dimenticare il rispetto che devo a me stessa.",
    extra: { title: "Le mie tre qualità", note: "Scrivile. Poi rileggile ad alta voce, senza aggiungere «però».", fields: ["Prima qualità", "Seconda qualità", "Terza qualità"] }
  },
  {
    n: 4, title: "Le relazioni: non dimenticarmi",
    sub: "Amare qualcuno non dovrebbe significare cancellare i miei bisogni.",
    intro: "Le relazioni possono darci gioia, sicurezza e condivisione. Possono anche portarci a interrogarci, soprattutto nei momenti di cambiamento. A volte cerchiamo continuamente l'altro; altre volte abbiamo paura di esprimere ciò che desideriamo. Non esistono risposte uguali per tutte, ma possiamo riconoscere ciò che è importante per noi.",
    q: [
      "In quale relazione sento di dover fare più fatica per essere ascoltata?",
      "Riesco a esprimere i miei bisogni senza sentirmi in colpa?",
      "Che cosa significa per me una relazione fatta di rispetto, presenza e reciprocità?"
    ],
    prompt: "In una relazione vorrei sentirmi:",
    step: "Individua un bisogno che ultimamente non hai espresso. Scrivilo in una frase semplice, senza accusare nessuno.",
    remember: "Dire ciò di cui ho bisogno non è chiedere troppo.",
    extra: {
      title: "Bisogno, confine, richiesta",
      note: "Esempio — Bisogno: «Ho bisogno di sentirmi ascoltata.» Confine: «Non voglio continuare una conversazione se vengo insultata.» Richiesta: «Vorrei che ne parlassimo con calma.»",
      fields: ["Il mio bisogno", "Il mio confine", "La mia richiesta"]
    }
  },
  {
    n: 5, title: "I desideri che ho rimandato",
    sub: "Non tutto quello che desidero deve appartenere al passato.",
    intro: "Con il tempo possiamo convincerci che alcuni progetti non siano più adatti alla nostra età o alla nostra situazione. Ma un desiderio non perde automaticamente valore perché è rimasto in attesa. Non dobbiamo realizzare tutto. Possiamo però concederci di capire che cosa desideriamo ancora.",
    q: [
      "Che cosa mi piacerebbe fare se smettessi di pensare subito agli ostacoli?",
      "Quale esperienza vorrei concedermi almeno una volta?",
      "Che cosa continuo a rimandare dicendomi che non è il momento giusto?"
    ],
    prompt: "Se oggi potessi regalarmi una possibilità, sarebbe:",
    step: "Scegli un desiderio e scrivi una prima azione concreta per avvicinarti a esso: informarti, telefonare, cercare un corso, fissare una data o semplicemente parlarne con qualcuno.",
    remember: "Posso avere ancora desideri, progetti e curiosità. Non devo chiedere il permesso alla mia età per averli.",
    extra: {
      title: "La lista che avevo dimenticato",
      note: "Dieci cose che vorrei ancora fare. Non devi farle tutte. Per ora devi solo permetterti di scriverle.",
      fields: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Quale di queste mi chiama di più, oggi?"],
      compact: 10
    }
  },
  {
    n: 6, title: "Le scelte che posso fare",
    sub: "Non devo cambiare tutta la mia vita per cominciare a scegliere diversamente.",
    intro: "Quando pensiamo al cambiamento, spesso immaginiamo decisioni enormi. Ma non sempre il primo passo deve essere così grande. A volte è una conversazione rimandata, un limite da esprimere, un pomeriggio dedicato a noi o una decisione che smettiamo di delegare.",
    q: [
      "Qual è una situazione nella quale vorrei comportarmi diversamente?",
      "Che cosa posso fare concretamente, senza pretendere di risolvere tutto?",
      "Quale paura potrebbe frenarmi e che cosa mi aiuterebbe ad affrontarla con maggiore serenità?"
    ],
    prompt: "La piccola scelta che voglio fare per me è:",
    step: "Scegli un'azione che puoi compiere entro le prossime 48 ore. Scrivila e, se possibile, stabilisci quando farla.",
    remember: "Non controllo tutto quello che accade, ma posso iniziare a riconoscere le scelte che mi appartengono.",
    extra: {
      title: "Trasforma l'intenzione in un piano",
      note: "Un'intenzione diventa reale quando ha un giorno e un'ora.",
      fields: ["Cosa voglio fare", "Primo passo", "Quando", "Cosa potrebbe fermarmi", "Cosa posso fare se succede", "A chi posso chiedere supporto"]
    }
  },
  {
    n: 7, title: "Ricominciare da me",
    sub: "Non devo diventare un'altra persona. Posso tornare a dare spazio a quella che sono.",
    intro: "In questi sette giorni ti sei fermata. Hai osservato la tua vita, riconosciuto alcuni bisogni, ripensato alle relazioni, ai desideri e alle possibilità che vorresti concederti. Forse hai trovato risposte. Forse sono emerse altre domande. Va bene così. Questo non è un traguardo. È il punto da cui, nella seconda settimana, inizi a scegliere.",
    q: [
      "Qual è la cosa più importante che ho capito di me in questi giorni?",
      "Che cosa non voglio più continuare a rimandare?",
      "Quale impegno realistico voglio prendermi per i prossimi sette giorni?"
    ],
    prompt: "Da questa prima settimana porto con me:",
    step: "Rileggi la tua «prima fotografia» qui sotto e scrivi che cosa è cambiato, anche di poco.",
    remember: "Non è troppo tardi per cominciare a scegliere anche me stessa.",
    showStart: true
  },
  {
    n: 8, title: "I miei confini",
    sub: "Ogni no detto a qualcosa è un sì detto a me.",
    intro: "Molte di noi hanno imparato che essere brave significa essere sempre disponibili. Così il no ci resta in gola, e al suo posto esce un sì stanco. Un confine non è un muro e non è una punizione per nessuno. È il modo in cui dico agli altri, e a me stessa, dove finisco io.",
    q: [
      "A che cosa ho detto di sì, questa settimana, mentre dentro dicevo di no?",
      "Che cosa temo che succeda se dico di no?",
      "Con chi mi è più difficile mettere un limite, e perché?"
    ],
    prompt: "Un no che voglio imparare a dire è:",
    step: "Oggi di' un piccolo no, gentile e senza giustificarti troppo. Anche solo: «Stavolta non riesco».",
    remember: "Posso dire di no e restare una persona buona.",
    extra: { title: "La mia frase pronta", note: "Scrivila adesso, così quando servirà l'avrai già. Esempio: «Ci tengo a te, ma questa volta non posso.»", fields: ["La situazione", "La frase che dirò"] }
  },
  {
    n: 9, title: "Il mio corpo",
    sub: "Il mio corpo non è un problema da sistemare. È la casa in cui vivo.",
    intro: "Per anni abbiamo guardato il nostro corpo con occhi severi: troppo, troppo poco, non più come prima. Eppure è lui che ci ha portate fin qui, attraverso tutto. Oggi non gli chiediamo di cambiare. Proviamo soltanto ad ascoltarlo.",
    q: [
      "Come parlo del mio corpo quando sono da sola davanti allo specchio?",
      "Di che cosa ha bisogno il mio corpo, che io continuo a rimandare? Riposo, movimento, una visita, tenerezza?",
      "Che cosa mi ha permesso di fare, questo corpo, di cui posso essergli grata?"
    ],
    prompt: "Oggi al mio corpo vorrei dire:",
    step: "Fai un gesto di cura solo per te: una camminata di dieci minuti, una crema messa con calma, andare a letto mezz'ora prima.",
    remember: "Prendermi cura di me non è vanità. È rispetto."
  },
  {
    n: 10, title: "La mia voce",
    sub: "Quello che non dico non scompare. Resta dentro.",
    intro: "Quante frasi abbiamo ingoiato per quieto vivere. Quante volte abbiamo detto «non importa» quando importava. Ritrovare la propria voce non significa alzarla. Significa smettere di toglierla dalle conversazioni che contano.",
    q: [
      "Che cosa non ho mai detto, e a chi?",
      "In quale situazione dico «non importa» anche se per me è importante?",
      "Come cambierebbe la mia giornata se dicessi una cosa vera in più?"
    ],
    prompt: "La cosa che non ho mai detto è:",
    step: "Scrivi qui sotto la lettera che non spedirai. Non devi mandarla a nessuno. Serve a te, per sentire la tua voce.",
    remember: "La mia opinione ha diritto di esistere, anche quando non mette tutti d'accordo.",
    extra: { title: "La lettera che non spedirò", note: "Scrivi senza correggerti. Nessuno la leggerà: resta solo su questo dispositivo.", fields: ["Cara / Caro…"], long: true }
  },
  {
    n: 11, title: "Il mio tempo",
    sub: "Il mio tempo non è quello che avanza dagli altri.",
    intro: "Se guardiamo una nostra settimana, spesso scopriamo che ogni ora appartiene a qualcuno: al lavoro, alla casa, ai figli, ai genitori. A noi restano i ritagli, quando restano. Il tempo per sé non si trova. Si decide.",
    q: [
      "Se guardo la mia ultima settimana: quante ore sono state davvero mie?",
      "Che cosa faccio per abitudine o per dovere, che potrei lasciare o delegare?",
      "Che cosa farei con due ore tutte per me, senza sensi di colpa?"
    ],
    prompt: "Il tempo che voglio proteggere è:",
    step: "Apri l'agenda e fissa un appuntamento con te stessa questa settimana. Con giorno e ora. Trattalo come quello con il medico: non si sposta.",
    remember: "Non devo guadagnarmi il riposo.",
    extra: { title: "Il mio appuntamento con me", note: "Scrivilo qui, poi mettilo davvero in agenda.", fields: ["Giorno e ora", "Che cosa farò", "Che cosa dirò se qualcuno mi chiede di spostarlo"] }
  },
  {
    n: 12, title: "Le persone giuste",
    sub: "Non devo farcela da sola per dimostrare di essere forte.",
    intro: "Ci sono persone accanto alle quali ci sentiamo più grandi, e persone accanto alle quali ci facciamo piccole. Non si tratta di tagliare o di giudicare. Si tratta di accorgersi di dove va la nostra energia, e di avvicinarci un po' di più a chi ci fa bene.",
    q: [
      "Accanto a chi mi sento più me stessa?",
      "Dopo aver visto chi, invece, mi sento svuotata?",
      "A chi non chiedo mai aiuto, anche se me lo darebbe volentieri?"
    ],
    prompt: "La persona che voglio sentire più spesso è:",
    step: "Scrivi o telefona oggi a una persona che ti fa bene. Senza un motivo. Solo per dirle che ci pensi.",
    remember: "Chiedere aiuto non mi rende debole. Mi rende meno sola."
  },
  {
    n: 13, title: "Il coraggio piccolo",
    sub: "Il coraggio non è non avere paura. È fare un passo con la paura accanto.",
    intro: "Aspettiamo spesso di sentirci pronte. Ma pronte non ci si sente quasi mai. Il coraggio che serve per ricominciare non è quello dei grandi gesti: è piccolo, quotidiano, a volte tremante. Una telefonata. Un'iscrizione. Una frase detta.",
    q: [
      "Che cosa farei se fossi sicura che nessuno mi giudicherebbe?",
      "Qual è la cosa peggiore che potrebbe realisticamente succedere? E poi, che cosa farei?",
      "In quale momento della mia vita sono stata più coraggiosa di quanto credessi?"
    ],
    prompt: "Il passo che mi fa paura e che voglio fare è:",
    step: "Fai oggi la versione più piccola possibile di quel passo: cerca l'informazione, scrivi il messaggio, chiedi il prezzo. Solo il primo centimetro.",
    remember: "Ho già attraversato cose più difficili di questa.",
    extra: { title: "Le prove del mio coraggio", note: "Tre momenti in cui ce l'hai fatta, anche quando pensavi di no. Rileggili ogni volta che dubiti.", fields: ["Quella volta che…", "Quella volta che…", "Quella volta che…"] }
  },
  {
    n: 14, title: "La mia promessa",
    sub: "Non una rivoluzione. Una promessa che posso mantenere.",
    intro: "Sei arrivata all'ultimo giorno. In queste due settimane ti sei guardata, ti sei ascoltata e hai iniziato a scegliere. Non hai risolto tutto, e non era questo lo scopo. Oggi dai una forma a ciò che vuoi portare con te: una promessa gentile, realistica, tua.",
    q: [
      "Qual è la cosa più importante che ho capito di me in questi quattordici giorni?",
      "Prima pensavo che… oggi mi accorgo che…",
      "Che cosa voglio smettere di fare, iniziare a fare, continuare a fare?"
    ],
    prompt: "La mia promessa. Da oggi voglio provare a:",
    step: "Firma la tua promessa: nella prossima schermata diventa un'immagine da salvare e tenere dove la vedi ogni giorno.",
    remember: "Non è troppo tardi per tornare a me.",
    extra: {
      title: "Le prossime quattro settimane",
      note: "Voglio provare a dedicarmi spazio senza aspettare di aver risolto tutto il resto.",
      fields: ["La cosa che voglio proteggere", "Il piccolo gesto che ripeterò", "Quando mi dimenticherò di me, proverò a"]
    },
    finale: true
  }
];

window.TAM_REMINDERS = [
  "Posso dire ciò che sento.",
  "Posso riconoscere i miei bisogni.",
  "Posso desiderare amore senza rinunciare al rispetto di me stessa.",
  "Posso avere nuovi progetti.",
  "Posso cambiare idea.",
  "Posso procedere con i miei tempi.",
  "Posso scegliere anche me."
];

window.TAM_LETTER = [
  "Se sei arrivata fin qui, voglio lasciarti un pensiero.",
  "Non so quale storia tu abbia attraversato. Non so quante volte tu abbia dovuto ricominciare, quante volte abbia messo da parte i tuoi desideri o quanto sia stato difficile arrivare a questo momento.",
  "Ma so che dedicare del tempo a te stessa non è una colpa.",
  "Non devi aspettare che tutti siano felici, che ogni problema sia risolto o che qualcuno ti dica che è arrivato il tuo turno.",
  "Puoi iniziare da una piccola attenzione. Da una domanda che non ti facevi da tempo. Da un desiderio che torni a prendere forma.",
  "Non devi dimostrare di essere forte ogni giorno. Puoi anche avere dubbi, cambiare idea e procedere lentamente.",
  "L'importante è non dimenticare che anche tu fai parte della tua vita."
];
