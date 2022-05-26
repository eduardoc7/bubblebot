const greeting_messages = [
  'ola',
  'oi',
  'oii',
  'oiii',
  'oiiii',
  'oiiiii',
  'oiiiiii',
  'dia',
  'tarde',
  'noite',
  'hey',
  'bem',
  'bomdia',
  'boanoite',
  'boatarde',
];

const greeting_message_to_reply = `Oiii. É um prazer tê-lo aqui. Seja muito bem vindo ao canal de atendimento e compras da ⭐ *[nome da empresa]* ⭐
  \nNossos robôs trabalham *24 horas por dia* e *7 dias da semana*, para oferecer o melhor atendimento aos nossos clientes.
  \nTodo o *processo de compra* é feito pelo Whatsapp de forma automatizada, basta *acessar nosso catálogo aqui* [link do catálogo] -> enviar um *carrinho com os produtos* que deseja comprar e cuidaremos do resto pra você ;).
  \nPara aprender a enviar um carrinho e fazer uma compra em nossa loja, digite: *#car* 
  \nVocê também pode digitar *#duvidas* para saber mais.`;

const created_status_message = `Olha só, que legal. Você já criou um pedido conosco nos enviando um carrinho.
\nPara prosseguir, basta digitar *#ok* ou nos enviar um *novo carrinho* e cuidaremos do resto pra você ;).
\n\nVocê também pode digitar *#duvidas* para saber mais`;

const confirm_data_status = `Ué, verifiquei aqui e você ainda não confirmou os dados do seu pedido.
\nPara isso digite: *sim* (prosseguir com o pedido) ou *não* (atualizar o carrinho)
\n\nVocê também pode digitar *#duvidas* para saber mais`;

const confirm_address_data = `Vamos lá! Falta pouco para finalizar seu pedido. Digite o método que deseja receber a sua compra
\nBasta digitar *Entrega* ou *Retirada*
\n\nVocê também pode digitar *#duvidas* para saber mais`;

const confirm_bairro_data = `Falta pouco para finalizar seu pedido.
\nDigite um número de *1 a 5* que corresponde ao seu balneário!
\n\nVocê também pode digitar *#duvidas* para saber mais`;

const confirm_delivery_data = `Vamos lá! Falta pouco para finalizar o seu pedido. Encontrei aqui o método de entrega que você selecionou.
\nPor favor, me envie os dados da sua *localização* para receber o seu pedido no conforto da sua casa.
\n\nVocê também pode digitar *#duvidas* para saber mais`;

const confirm_payment_data = `Você está na última etapa para finalização do seu pedido.
\nPor favor, nos envie o método de pagamento de sua preferência: *Cartão*, *Dinheiro* ou *Pix*`;

const production_status_message = `Opa, legal 🥳🥳. Verifiquei aqui e vi que você tem um pedido sendo preparado com muito cuidado pela nossa produção. 🧰
\nVocê será *notificado* quando ele estiver pronto para entrega ou retirada.
\nPara visualizar seu pedido digite: *#ver*
\nPara gerar um novo pedido nos envie outro carrinho (você pode fazer isso quantas vezes quiser :>): *#car*
\n\nVocê também pode digitar *#duvidas* para saber mais`;

const entrega_status_message = `Opa, legal 🥳🥳. Verifiquei aqui e vi que o seu pedido está a caminho da sua localização. Qualquer atualização avisaremos!
\n\nVocê também pode digitar *#duvidas* para saber mais`;

const retirada_status_message = `Opa, legal 🥳🥳. Verifiquei aqui e vi que você tem um pedido pronto para retirada. Estamos aguardando você.
\nPara saber mais sobre o seu pedido digite: *#ver*
\n\nVocê também pode digitar *#duvidas* para saber mais`;

const payment_required_message = `Vamos lá! Falta pouco para adquirir seus produtos, realize o pagamento para começarmos a preparar a sua encomenda.
\n\nVocê também pode digitar *#duvidas* para saber mais`;

const production_message = `Oba!! Seu pedido foi enviado para produção, você será notificado quando estiver pronto para entrega ou retirada.
\n\nAgradecemos com muita ênfase a preferência. ❤️
\nNos siga nas redes sociais para não perder nenhuma novidade:
👉Instagram - [link do instagram]
👉Facebook - [link do Facebook]
👉Whatsapp - [link para contato]
\nCompartilhe!`;

const finished_order_message = `Estamos muito contente com a sua compra na nossa loja. Obrigado por utilizar nossos serviços, trabalhamos para sua experiência conosco ser a melhor!
\nAgora você pode fazer um novo pedido: *#car*
\nE visualizar o seu pedido finalizado: *#ver*

\n\nVocê também pode digitar *#duvidas* para saber mais`;

const last_option_message = `Eita, que coisa. Não entendi :/ \nMas está tudo bem.
\n\nVocê pode digitar *#duvidas* para saber mais informações sobre nós.`;

export {
  greeting_messages,
  greeting_message_to_reply,
  production_status_message,
  last_option_message,
  created_status_message,
  confirm_data_status,
  confirm_address_data,
  confirm_delivery_data,
  confirm_payment_data,
  confirm_bairro_data,
  production_message,
  payment_required_message,
  finished_order_message,
  entrega_status_message,
  retirada_status_message,
};
