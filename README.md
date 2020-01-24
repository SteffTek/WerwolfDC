# WerwolfDC (WIP)
Ein Discord-Bot für das beliebte Spiel Werwolf.

Dieser Bot übernimmt das Erstellen und Managen von Werwolf-Rollenspielen über mehrere Discord-Server Hinweg.

[Discord Bot Link](https://discordapp.com/oauth2/authorize?&client_id=666656065793818634&scope=bot&permissions=272706672)

## Commands

#### Hilfe Anzeigen
> /help

#### Den Bot nach dem Joinen Aufsetzen (Falls es nicht klappt)
> /setup

#### Spiel erstellen
> /create emoji nachricht

#### Rollen festlegen
> /pool [anz name(chat)][]...

> Bsp: /pool 3 Werwolf(wwchat) Hexe(hexe) 3 Dorfbewohner

#### Nächste Gamephase
> /next

#### Eine Gamephase zurück (Nur während RoleChecking)
> /back

#### Spiel schließen
> /close

#### Nutzer hinzufügen
##### (Role nur während Phase <ingame> benötigt)
##### Nur während Ingame und Created nutzbar
> /add user [role]

#### Nutzer entfernen
> /kick user

#### Spieler Muten Umschalten
##### Wenn Spielername angegeben wird nur dieser Gemuted/Entmuted
> /mute [user]

#### Spieler auflisten
> /list

#### Spielleitung übergeben
> /leader user

#### Abstimmung erstellen
##### (Public = User Votes werden direkt angezeigt)
> /poll [private]

#### Rolle ändern
> /role user newRole(chat)

#### Rollen mischen
##### In Rolechecking die Rollen neu mischen
> /shuffle

## Die Spielphasen

### Phase 1: __created__

> Das Spiel wurde erstellt

#### Phasen-Regeln:
- Jeder kann dem Spiel Beitreten
- Pool kann erstellt werden
- Nutzer können Hinzugefügt/Gekickt werden

### Phase 2: __rolechecking__

> Rollenüberprüfung durch Spielleiter im Spielleiter-Channel.

#### Phasen-Regeln:
- dem Spiel kann NICHT mehr beigetreten werden
- Pool kann erstellt werden
- Nutzer können NICHT Hinzugefügt werden (Zurück zu Created mit /back)
- Nutzer können gekickt werden
- Rollen können geshuffeld werden
- Es kann zurück in die Phase created gewechselt werden

### Phase 3: __ingame__

> Die Ingame-Phase

#### Phasen-Regeln:
- dem Spiel kann NICHT mehr beigetreten werden
- Pool bleibt unverändert
- Nutzer können nur noch mit ROLLE Hinzugefügt/Gekickt werden
- Es können keine neuen Channel erstellt werden
- Rollen können nicht mehr geshuffeld werden
- Ein Phasenwechsel ist nicht möglich
- Es können Polls erstellt werden

### Phase 4: __closed__

> Das Spiel ended

#### Phasen-Regeln:
- die Rollen werden entfernt
- die Channel werden gelöscht
- WIP Matchhistory wird gepublished
