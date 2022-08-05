const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");

const closed_ticket_row = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId("tickets-actions-reopen")
        .setLabel("Znovuotevřít")
        .setEmoji("♻️")
        .setStyle("SECONDARY"),
    new MessageButton()
        .setCustomId("tickets-actions-delete")
        .setLabel("Smazat")
        .setEmoji("🗑️")
        .setStyle("DANGER")
)

const new_ticket_row = new MessageActionRow().addComponents(
    new MessageButton()
        .setLabel("Zavřít")
        .setEmoji("❌")
        .setStyle("DANGER")
        .setCustomId("tickets-actions-close"),
    new MessageButton()
        .setLabel("Vzít")
        .setEmoji("✋")
        .setStyle("PRIMARY")
        .setCustomId("tickets-actions-claim")
)

const reopened_ticket_row = new MessageActionRow().addComponents(
    new MessageButton()
        .setLabel("Zavřít")
        .setEmoji("❌")
        .setStyle("DANGER")
        .setCustomId("tickets-actions-close"),
)

module.exports = {
    general: {
        name: "General panel",
        channel_format: "ticket・{id}",
        category_id: "966720965268619335",
        closed_category_id: "966721713125617715",
        logs: {
            channel_id: "952974654560165929",
            types: {
                create: true,
                claim: true,
                close: true,
                reopen: true,
                delete: true,
            }
        },
        messages: {
            created_info: {
                content: `> 💚 — Ticket byl úspěšně vytvořen!\n{channel}`,
                ephemeral: true
            },
            click_to_create: {
                embeds: [
                    new MessageEmbed()
                        .setColor("#29bfff")
                        .setTitle("❔ — Let's Study Podpora")
                        .setDescription("`・` Tickety slouží k řešení spoluprácí, nahlašování chyb a otázkám ohledně serveru nebo našich projektů.\nV každém ticketu najdeš formulář, který vyplníš do chatu a odešleš. Tím nám ušetříš čas.\n\n**📋 — Základní pravidla**\n`›` Pečlivě si přečti formulář a vyplň ho\n`›` Doba odezvy na tvůj ticket není nikým stanovena, věnujeme se ti ve svém volném čase\n`›` Pokud špatně vyplníš formulář, můžeme ti smazat ticket\n`›` Chovej se prosím ohleduplně a trpělivě\n\n❗ **Pokud budeš zneužívat podporu, hrozí ti ban na serveru.**")
                ],
                components: [
                    new MessageActionRow().addComponents(new MessageSelectMenu()
                    .setCustomId("tickets-actions-create-general")
                    .addOptions(
                        {
                            label: "Dotaz",
                            value: "tickets-create-general-question",
                            description: "Máš dotaz nebo potřebuješ něco vědět?",
                            emoji: "❔"
                        },
                        {
                            label: "Nahlášení chyby",
                            value: "tickets-create-general-report",
                            description: "Našel si chybu v našich projektech? Napiš nám!",
                            emoji: "🔧"
                        },
                        {
                            label: "Spolupráce",
                            value: "tickets-create-general-partnership",
                            description: "Chceš spolupracovat s Let's Study! Otevři ticket a napiš!",
                            emoji: "🤝"
                        },
                        {
                            label: "Ostatní",
                            value: "tickets-create-general-other",
                            description: "Žádná kategorie nevyjadřuje tvůj problém? Zkus tuhle.",
                            emoji: "🤔"
                        }
                    ))
                ]
            },
            created: {
                embeds: [
                    new MessageEmbed()
                    .setColor("#1cc2ff")
                    .setTitle("👋 — Vítej v ticketu!")
                    .setDescription("Vítej v ticketu {usermention}!\nVyplň prosím formulář níže do chatu abychom tvůj ticket mohli vyřešit co nejrychleji (a nebyl uzavřen).\n\n*Formulář:*\n```Vypiš, prosím, tvůj problém, dotaz nebo cokoliv do chatu podrobně. Nic víc.```")
                ],
                components: [ new_ticket_row ]
            },
            claim: {
                content: `> ♻️ — {usermention} si vzal na starost tento ticket.`
            },
            closed: {
                embeds: [
                    new MessageEmbed()
                        .setColor("#ff1c51")
                        .setTitle("❌ — Ticket byl uzavřen")
                        .setDescription("Tento ticket byl uzavřen uživatelem {usermention}.")
                ],
                components: [ closed_ticket_row ]
            },
            reopen: {
                embeds: [
                    new MessageEmbed()
                        .setColor("#1cff64")
                        .setTitle("♻️ — Ticket byl znovuotevřen")
                        .setDescription("{usermention} znovuotevřel tento ticket.")
                ],
                components: [ reopened_ticket_row ]
            },
            permission_eror: {
                content: `> ❌ — Nemáš dostatečná práva na tuto akci.`,
                ephemeral: true
            }
        },
        categories: {
            question: {
                channel_format: "dotaz・{id}",
                messages: {
                    created: {
                        embeds: [
                            new MessageEmbed()
                                .setColor("#1cc2ff")
                                .setTitle("👋 — Vítej v ticketu!")
                                .setDescription("Vítej v ticketu {usermention}!\nVyplň prosím formulář níže do chatu abychom tvůj ticket mohli vyřešit co nejrychleji (a nebyl uzavřen).\n\n*Formulář:*\n```Vypiš, prosím, tvůj dotaz do chatu podrobně. Nic víc.```")
                        ],
                        components: [ new_ticket_row ]
                    }
                }
            },
            report: {
                channel_format: "chyba・{id}",
                messages: {
                    created: {
                        embeds: [
                            new MessageEmbed()
                            .setColor("#1cc2ff")
                            .setTitle("👋 — Vítej v ticketu!")
                            .setDescription("Vítej v ticketu {usermention}!\nVyplň prosím formulář níže do chatu abychom tvůj ticket mohli vyřešit co nejrychleji (a nebyl uzavřen).\n\n*Formulář:*\n```Název chyby:\nKde si chybu našel:\nJak zreprodukovat tuto chybu (jak se ti ta chyba stala):```")
                        ],
                        components: [ new_ticket_row ]
                    }
                }
            },
            partnership: {
                channel_format: "spoluprace・{id}",
                messages: {
                    created: {
                        embeds: [
                            new MessageEmbed()
                            .setColor("#1cc2ff")
                            .setTitle("👋 — Vítej v ticketu!")
                            .setDescription("Vítej v ticketu {usermention}!\nVyplň prosím formulář níže do chatu abychom tvůj ticket mohli vyřešit co nejrychleji (a nebyl uzavřen).\n\n*Formulář:*\n```Server, s kterým chceš navázat spolupráci:\nMajitel serveru:\nPočet členů (nepočítáme boty):\nV pár větách o čem server je:\nProč si myslíš, že bychom měli s tebou navázat spolupráci:\nPermanentní pozvánka na server:```")
                        ],
                        components: [ new_ticket_row ]
                    }
                }
            },
            other: {
                channel_format: "jine・{id}",
                messages: {
                    created: {
                        embeds: [
                            new MessageEmbed()
                            .setColor("#1cc2ff")
                            .setTitle("👋 — Vítej v ticketu!")
                            .setDescription("Vítej v ticketu {usermention}!\nVyplň prosím formulář níže do chatu abychom tvůj ticket mohli vyřešit co nejrychleji (a nebyl uzavřen).\n\n*Formulář:*\n```Vypiš, prosím, podrobně do chatu tvůj problém, dotaz nebo cokoliv, co nezapadalo ani do jedné z kategorií. To je vše.```")
                        ],
                        components: [ new_ticket_row ]
                    }
                }
            }
        }
    }
};