const entry_button = document.getElementById("entry-button");
if (entry_button) {
  entry_button.addEventListener("click", function() {
    window.location.href = "denial1.html";
    console.log("entry button clicked");
  });
}

const stage = document.body.id;

let phrases = [];
let buttonPhrases = [];
let redirect = "";

if (stage === "denial") {
    phrases = [
      "I don’t think it’s really over.",
      "They probably just need space.",
      "We always find our way back to each other.",
      "They’ll text me any second now.",
      "This was just a fight, not the end.",
      "They didn’t mean what they said.",
      "No one else gets me like they do.",
      "What if I had said the right thing?",
      "Maybe if I reach out one more time...",
      "This can’t be how it ends."
    ];
    button_phrases = [
      "I'm not ready yet",
      "I said I'm not ready yet",
      "Please don't make me go",
      "Please? Can I stay",
      "This hurts too much",
      "I can't",
      "I'm not ready!!!",
      "This is not real",
      "Just one more time",
      "ok fine"
    ];
    redirect = "anger1.html";
  }
  
  if (stage === "anger") {
    phrases = [
      "How dare they leave me.",
      "After everything I gave?",
      "They didn’t even fight for me.",
      "I was always the one trying.",
      "They never really loved me.",
      "I hope they’re miserable.",
      "They’re going to regret this.",
      "Maybe I never mattered to them.",
      "They replaced me like I was nothing.",
      "I deserve better."
    ];
    button_phrases = [
      "Nope, still mad",
      "Even madder",
      "I'm still fuming",
      "I’m not done yet",
      "Do you even hear me??",
      "They’ll see",
      "I'd lke to watch them burn",
      "Just one more rage click",
      "Screaming, but ugh ok",
      "Fine. Next."
    ];
    redirect = "bargain1.html";
  }
  if (stage === "bargain") {
    phrases = [
      "Maybe if I had loved them better...",
      "What if I just send one more message?",
      "If I change, maybe they'll come back.",
      "We were too good to give up this easily.",
      "They just need time. I can wait.",
      "I’ll do anything to make it work.",
      "Maybe we’re just on pause.",
      "I could forgive everything, if they asked.",
      "I think they’re still thinking about me.",
      "I’d take them back in a heartbeat."
    ];
    button_phrases = [
      "No, I want to try again",
      "Pleas, can I?",
      "I can fix this",
      "Tell me what to do",
      "Just one more chance",
      "I'll do anything",
      "Don't go",
      "We can make it",
      "Still hoping",
      "Ok, but it hurts"
    ];
    redirect = "depression1.html";
  }
  if (stage === "depression") {
    phrases = [
      "I don’t want to get out of bed.",
      "Nothing feels real anymore.",
      "I can't stop checking my phone.",
      "The silence is too loud.",
      "I keep reliving everything we said.",
      "I miss them so much.",
      "I feel like I can't breathe.",
      "I don’t recognize myself.",
      "Some part of me is still waiting.",
      "I don’t know how to move on."
    ];
    button_phrases = [
      "It’s too quiet",
      "No, I'm still hurting",
      "Why does it still ache?",
      "Make it stop",
      "I miss them",
      "Everything hurts",
      "It feels so heavy",
      "I feel lost",
      "Can't let go",
      "I’m still here"
    ];
    redirect = "acceptance1.html";
  }
  if (stage === "acceptance") {
    phrases = [
      "I think I’m starting to let go.",
      "Some things are not meant to last.",
      "They were important, but not forever.",
      "I can love someone and still leave.",
      "It still hurts, but it doesn't own me.",
      "I’m learning to love myself instead.",
      "There is life after them.",
      "I don't need to rewrite the ending.",
      "I deserve peace too.",
      "This was a chapter. Not the whole story."
    ];
    button_phrases = [
      "I’m breathing again",
      "I made it here",
      "It’s okay now",
      "This feels lighter",
      "I survived",
      "No more",
      "I’m moving forward",
      "I've gotten closure",
      "I found myself",
      "I've made it"
    ];
    redirect = "hyperlinkprj.html";
  }

function move_container() {
  const container = document.querySelector('.stage-container');

  const maxTop = window.innerHeight - container.offsetHeight;
  const maxLeft = window.innerWidth - container.offsetWidth;

  const top = Math.random() * maxTop;
  const left = Math.random() * maxLeft;

  container.style.position = 'absolute';
  container.style.top = top + "px";
  container.style.left = left + "px";
}
    
let index = 0;
  
const journal = document.querySelector('.journal'); 
const button = document.getElementById("next-button");

if (journal && button){
  button.addEventListener("click", function () {
    if (index < phrases.length) {
      journal.textContent = phrases[index];
      button.textContent = button_phrases[index];
      index++;
      move_container();
    } else if (index === phrases.length) {
      journal.textContent = "Maybe it’s time to let go.";
      button.textContent = "Yes";
      index++;
    } else {
      window.location.href = redirect;
    }
  });
}

