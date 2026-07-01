/* Lista de convidados para identificação automática de grupo */

const GUEST_LIST = [
  // ── NOIVO — Família ─────────────────────────────────────────
  { name: "Jacirene Barbosa santos",          side: "noivo", group: "familia" },
  { name: "Josafa Pereira Reis",              side: "noivo", group: "familia" },
  { name: "Ana Karolina santos Reis",         side: "noivo", group: "familia" },
  { name: "Eliane souza de Oliveira",         side: "noivo", group: "familia" },
  { name: "João Mateus Sousa Silva",          side: "noivo", group: "familia" },
  { name: "Elieder Sousa Silva",              side: "noivo", group: "familia" },

  // ── NOIVO — Pastores ────────────────────────────────────────
  { name: "Aleondas Leite Ribeiro",           side: "noivo", group: "pastores" },
  { name: "Patrícia rodovalho",               side: "noivo", group: "pastores" },

  // ── NOIVO — Padrinhos e Madrinhas ───────────────────────────
  { name: "Samuel Cunha",                     side: "noivo", group: "padrinhos" },
  { name: "Andreia Cunha",                    side: "noivo", group: "padrinhos" },
  { name: "Samuel Santana",                   side: "noivo", group: "padrinhos" },
  { name: "Nayane Santana",                   side: "noivo", group: "padrinhos" },
  { name: "Marlon Yuri",                      side: "noivo", group: "padrinhos" },
  { name: "Paula Gonçalves",                  side: "noivo", group: "padrinhos" },
  { name: "Samuel Oliveira",                  side: "noivo", group: "padrinhos" },
  { name: "Dane Veríssimo",                   side: "noivo", group: "padrinhos" },
  { name: "Hyann Túlio",                      side: "noivo", group: "padrinhos" },
  { name: "Alana Santana",                    side: "noivo", group: "padrinhos" },
  { name: "Dayvid Mattheus",                  side: "noivo", group: "padrinhos" },
  { name: "Jhessica Beatriz",                 side: "noivo", group: "padrinhos" },

  // ── NOIVO — Amigos ──────────────────────────────────────────
  { name: "Reinan Sodré",                     side: "noivo", group: "amigos" },
  { name: "Akila Fernandes",                  side: "noivo", group: "amigos" },
  { name: "luis felipe",                      side: "noivo", group: "amigos" },
  { name: "Daniel gomes",                     side: "noivo", group: "amigos" },
  { name: "Eliezer santos",                   side: "noivo", group: "amigos" },
  { name: "David Nicolas novais",             side: "noivo", group: "amigos" },
  { name: "wsiel Vinicius de Sousa Soares",   side: "noivo", group: "amigos" },
  { name: "Márcio Gleik",                     side: "noivo", group: "amigos" },
  { name: "Luciano Silva",                    side: "noivo", group: "amigos" },
  { name: "Ronald Matheus leite pedroso",     side: "noivo", group: "amigos" },

  // ── NOIVO — Convidados ──────────────────────────────────────
  { name: "Eliane Martins",                   side: "noivo", group: "convidados" },
  { name: "Adeilton novais",                  side: "noivo", group: "convidados" },
  { name: "Vinicius Amorim",                  side: "noivo", group: "convidados" },
  { name: "Reivia Cristina Sodré",            side: "noivo", group: "convidados" },
  { name: "andriely Sousa",                   side: "noivo", group: "convidados" },
  { name: "Milena Pereira dos santos",        side: "noivo", group: "convidados" },
  { name: "Laiany Silva",                     side: "noivo", group: "convidados" },
  { name: "Wellington de Lima",               side: "noivo", group: "convidados" },
  { name: "Dalitty Martins dos santos Pereira", side: "noivo", group: "convidados" },
  { name: "Katia Amorim",                     side: "noivo", group: "convidados" },
  { name: "Vinícios Batista Oliveira",        side: "noivo", group: "convidados" },
  { name: "Diogo luz santos",                 side: "noivo", group: "convidados" },
  { name: "Simeri Vieira Cavalcante",         side: "noivo", group: "convidados" },
  { name: "josiane de Sousa Azambuja",        side: "noivo", group: "convidados" },
  { name: "Maysa Azambuja",                   side: "noivo", group: "convidados" },
  { name: "Carlos Kayky",                     side: "noivo", group: "convidados" },
  { name: "Geovana Azambuja",                 side: "noivo", group: "convidados" },
  { name: "Evelyn Azambuja",                  side: "noivo", group: "convidados" },
  { name: "Gabrielly leite pedroso",          side: "noivo", group: "convidados" },
  { name: "Neuriene Pereira",                 side: "noivo", group: "convidados" },
  { name: "Ronaldo Pedroso",                  side: "noivo", group: "convidados" },

  // ── NOIVA — Família ─────────────────────────────────────────
  { name: "Nubia Quele dias da mata",         side: "noiva", group: "familia" },
  { name: "Rogério Paulo C.V da Rocha",       side: "noiva", group: "familia" },
  { name: "Yasmin Victoria Dias da Rocha",    side: "noiva", group: "familia" },
  { name: "Bercholina Rosa",                  side: "noiva", group: "familia" },
  { name: "Luiz da Mata",                     side: "noiva", group: "familia" },
  { name: "Laura Cardoso",                    side: "noiva", group: "familia" },
  { name: "Donizete Cardoso",                 side: "noiva", group: "familia" },
  { name: "Divina Cardoso",                   side: "noiva", group: "familia" },
  { name: "Luiz Lopes",                       side: "noiva", group: "familia" },
  { name: "Maria Francisca de Jesus",         side: "noiva", group: "familia" },

  // ── NOIVA — Pastores ────────────────────────────────────────
  { name: "Neilton Ferreira de Souza",        side: "noiva", group: "pastores" },
  { name: "Cynthia Christina Germano",        side: "noiva", group: "pastores" },

  // ── NOIVA — Padrinhos e Madrinhas ───────────────────────────
  { name: "Nycoli D'Diva Ferreira da Silva",  side: "noiva", group: "padrinhos" },
  { name: "Luíz Fernando Silva",              side: "noiva", group: "padrinhos" },
  { name: "Lívia Pereira da Silva",           side: "noiva", group: "padrinhos" },
  { name: "Leonardo Oliveira da Silva",       side: "noiva", group: "padrinhos" },
  { name: "Fabíola da Silva",                 side: "noiva", group: "padrinhos" },
  { name: "Pedro Henrique Silva",             side: "noiva", group: "padrinhos" },
  { name: "Júlya Mikaeli Silva de Deus",      side: "noiva", group: "padrinhos" },
  { name: "Breno paixão",                     side: "noiva", group: "padrinhos" },
  { name: "Leoniza Pereira",                  side: "noiva", group: "padrinhos" },
  { name: "Vinicius Pereira",                 side: "noiva", group: "padrinhos" },
  { name: "Jocelia Ferreira",                 side: "noiva", group: "padrinhos" },
  { name: "Gilvan Marques",                   side: "noiva", group: "padrinhos" },

  // ── NOIVA — Amigas ──────────────────────────────────────────
  { name: "Samylla Victoria",                 side: "noiva", group: "amigas" },
  { name: "Lais Monteiro",                    side: "noiva", group: "amigas" },
  { name: "Mallayne Santos",                  side: "noiva", group: "amigas" },
  { name: "Steffany Pereira",                 side: "noiva", group: "amigas" },

  // ── NOIVA — Convidados ──────────────────────────────────────
  { name: "Jaine Alves da Silva",             side: "noiva", group: "convidados" },
  { name: "Josiane Alves da Silva souza Germano", side: "noiva", group: "convidados" },
  { name: "Elaine Roberta Moura",             side: "noiva", group: "convidados" },
  { name: "Cristina Silva",                   side: "noiva", group: "convidados" },
  { name: "Elen Silva",                       side: "noiva", group: "convidados" },
  { name: "Neire Aparecida",                  side: "noiva", group: "convidados" },
  { name: "Izani Bueno",                      side: "noiva", group: "convidados" },
  { name: "Denise Bueno",                     side: "noiva", group: "convidados" },
  { name: "Marcela Ferreira da Silva",        side: "noiva", group: "convidados" },
  { name: "Neirivan ferreira",                side: "noiva", group: "convidados" },
  { name: "Rozilda Alvez",                    side: "noiva", group: "convidados" },
  { name: "Laura Kimberly Barbosa",           side: "noiva", group: "convidados" },
  { name: "Guilherme Pereira",                side: "noiva", group: "convidados" },
  { name: "Igor Luizmar",                     side: "noiva", group: "convidados" },
  { name: "Vitória Oliveira",                 side: "noiva", group: "convidados" },
  { name: "Sarina Neves",                     side: "noiva", group: "convidados" },
  { name: "Adriana Souza Soares",             side: "noiva", group: "convidados" },
  { name: "Iraides Souza",                    side: "noiva", group: "convidados" },
  { name: "Ilda Queiroz",                     side: "noiva", group: "convidados" },
  { name: "Iza Silva",                        side: "noiva", group: "convidados" },
  { name: "Stefany Silva Figueiredo",         side: "noiva", group: "convidados" },
  { name: "Daiane Silva",                     side: "noiva", group: "convidados" },
  { name: "Regiane Cristina de Jesus",        side: "noiva", group: "convidados" },
  { name: "Carmen Lúcia",                     side: "noiva", group: "convidados" },
  { name: "Cintia Silva",                     side: "noiva", group: "convidados" },
  { name: "Juliana Duarte",                   side: "noiva", group: "convidados" },
  { name: "Sandra Maia",                      side: "noiva", group: "convidados" },
  { name: "Jamilly Maia",                     side: "noiva", group: "convidados" },
  { name: "Vanessa Cardoso",                  side: "noiva", group: "convidados" },
  { name: "Dora Rocha Cardoso",               side: "noiva", group: "convidados" },
  { name: "Raimundo Da Rocha Cardoso",        side: "noiva", group: "convidados" },
  { name: "Domingos da Rocha",                side: "noiva", group: "convidados" },
  { name: "Deides Rocha",                     side: "noiva", group: "convidados" },
  { name: "Fabio Cardoso da Rocha",           side: "noiva", group: "convidados" },
  { name: "Marta Cardoso",                    side: "noiva", group: "convidados" },
  { name: "Elma Siqueira",                    side: "noiva", group: "convidados" },
  { name: "Nathalia Siqueira",                side: "noiva", group: "convidados" },
  { name: "Keila Ferreira",                   side: "noiva", group: "convidados" },
  { name: "Franciela Inácio",                 side: "noiva", group: "convidados" },
  { name: "Karla oliveira",                   side: "noiva", group: "convidados" },
  { name: "Priscylla Matos",                  side: "noiva", group: "convidados" },
  { name: "Ana Paula Alvez",                  side: "noiva", group: "convidados" },
  { name: "Roseli Cardoso",                   side: "noiva", group: "convidados" },
  { name: "Marcelly Cristiny",                side: "noiva", group: "convidados" },
  { name: "Daiana Cardoso",                   side: "noiva", group: "convidados" },
  { name: "Luana Gonçalves",                  side: "noiva", group: "convidados" },
  { name: "Eliane Cardoso",                   side: "noiva", group: "convidados" },
  { name: "Maristela Cardoso",                side: "noiva", group: "convidados" },
  { name: "Karen medrado",                    side: "noiva", group: "convidados" },
  { name: "Ileuza da Mata",                   side: "noiva", group: "convidados" },
  { name: "Diolina Borges",                   side: "noiva", group: "convidados" },
];

function normalizeName(name) {
  return String(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findGuest(inputName) {
  const normalized = normalizeName(inputName);
  return GUEST_LIST.find(g => normalizeName(g.name) === normalized) || null;
}
