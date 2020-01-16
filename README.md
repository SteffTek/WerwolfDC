# WerwolfDC (WIP)
Ein Discord-Bot für das beliebte Spiel Werwolf.

Dieser Bot übernimmt das Erstellen und Managen von Werwolf-Rollenspielen über mehrere Discord-Server Hinweg.

## Commands

#### Hilfe Anzeigen
> /help

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
Da User@Mention benötigt, kann nur in öffentlichen Spiel-Kanälen genutzt werden.
> /add user@mention [role]

#### Nutzer entfernen
> /kick user

#### Spieler Muten Umschalten
##### Wenn Spielername angegeben wird nur dieser Gemuted/Entmuted
> /mute [user]

#### Spieler auflisten
> /list

#### Spielleitung übergeben
Da User@Mention benötigt, kann nur in öffentlichen Spiel-Kanälen genutzt werden.
> /leader user@mention

#### Abstimmung erstellen
##### (Public = User Votes werden direkt angezeigt)
> /poll [public]

#### Rolle ändern
> /role user newRole(chat)

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
- Nutzer können Hinzugefügt/Gekickt werden
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
