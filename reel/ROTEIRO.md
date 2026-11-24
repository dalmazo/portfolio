# Fortnite UI Reel — roteiro

Reel de **~60 segundos**, 1920×1080, 60 fps. A ordem abre com o trabalho mais
forte (o battle pass em MVVM) e fecha com contato. Cada trecho tem uma legenda
curta dizendo **o que foi seu**, porque num reel de tech art o recrutador
precisa saber qual parte você fez.

| # | Trecho | Duração | O que gravar | Legenda (título · detalhe) |
|---|--------|---------|--------------|-----------------------------|
| 0 | Abertura | 2.5 s | gerada pelo script | Rafael Dalmazo · Fortnite UI Reel |
| 1 | Battle pass | 8–10 s | Navegar pela página do passe: trocar de página, abrir uma recompensa, voltar | Battle Pass rebuilt on MVVM · UE5 MVVM · Widget Blueprints |
| 2 | OG Pass | 6 s | O fundo animado do Spectra Knight, parado na tela por alguns segundos | OG Pass — Spectra Knight · UI materials · animation |
| 3 | TMNT | 8 s | As transições entre páginas e os materiais do evento | TMNT — materials & transitions · Custom UI materials |
| 4 | Jujutsu Kaisen | 6 s | A tela do evento, com foco nos materiais | Jujutsu Kaisen event · Widgets · UI materials |
| 5 | Avatar | 5 s | As animações dos widgets | Avatar event · Widget animations · Materials |
| 6 | Pirates of the Caribbean | 5 s | A tela do evento | Pirates of the Caribbean event · Materials · Widgets |
| 7 | Encerramento | 3.5 s | gerado pelo script | nome · e-mail · portfolio |

## De onde vem cada trecho

- **Dá para gravar hoje:** o que ainda está no jogo (a página de passes atual, o
  Locker, a Woven Shadowblade se você tiver). Grave com o OBS ou com Win+Alt+R,
  em 1080p/60, sem HUD de stream nem notificações.
- **Eventos e passes que já saíram:** use material oficial da Epic para imprensa
  e coloque "Footage: Epic Games" no detalhe da legenda. Não use vídeos baixados
  do YouTube.
- **Gravações da época de Epic:** só o que já foi lançado publicamente. Confira o
  seu contrato antes.
- **Música:** opcional. Se usar, escolha uma faixa royalty-free e salve como
  `reel/music.mp3`. Sem ela, o reel sai sem som, o que é comum em reels de UI.

## Como montar

1. Coloque as gravações em `reel/footage/` (essa pasta não vai para o git).
2. Abra `reel/clips.csv` e ajuste, para cada linha: o arquivo, o início e o fim
   (em segundos ou `mm:ss`), o título e o detalhe da legenda. Linhas cujo arquivo
   ainda não existe são puladas, então dá para montar aos poucos. Deixe o título
   vazio para um trecho seguir a legenda do anterior sem repetir (como nos Piratas).
3. Dê dois cliques em `build-reel.bat` (na raiz do projeto).
4. O resultado sai em `reel/out/fortnite-reel.mp4`. Quando estiver bom, rode
   `build-reel.bat --publish` para copiar para `public/videos/`.

Precisa do **ffmpeg** instalado (`winget install Gyan.FFmpeg`).
