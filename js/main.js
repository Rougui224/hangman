import { mots,descriptions } from "./mots.js";
//**************** */ Variables ***************************
// Obtenir la racine de tous les elements pour gerer le theme
const root                           = document.documentElement
// les autres éléments html
const body                           = document.body;
const boutonMode                     = document.querySelector('.information_jeu_mode')
const modal                          = document.querySelector('.modal')
const boutonModalOK                  = document.querySelector('.modal_boutons_ok')
const boutonModalNePlusAfficher      = document.querySelector('.modal_boutons_nePlusAfficher')
const backgroundModal                = document.querySelector('.bodyModalBackground')
const afficherMotATrouver            = document.querySelector('.motATrouver div')
const afficherDescription            = document.querySelector('.information_mot p')
const boutonRecommencer              = document.querySelector('.header_recommencer')
const clavier                        = document.querySelectorAll('.clavier button')
const afficherVie                    = document.querySelector('.information_jeu_vies span')
const afficherScore                    = document.querySelector('.information_jeu_score span')
const afficherRecord                    = document.querySelector('.information_jeu_record span')
const acheterUneLettre               = document.querySelector('.information_jeu_AcheterUneVie button')
const afficherResultat               = document.querySelector('.modalResultat')
const h3                             = document.querySelector('.modalResultat h3')
const p                              = document.querySelector('.modalResultat p')
const boutonModalResultat                         = document.querySelector('.modalResultat button')
// ***********fonctions et conditions***************************
 // Vérifier si le thème sombre est déjà activé via le localStorage
    if(localStorage.getItem('theme')){
        if(localStorage.getItem('theme') =='sombre'){
            modeSombre()
        }
    }

// Vérification si l'utilisateur a choisi de masquer le modal précédemment
    if(localStorage.getItem('NePlusAfficher')){
        fermerModal()
    }else {
        afficherModal()
    }
// Verifier si un record existe deja 
    let record            = 0
    if(localStorage.getItem('record')){
        console.log(localStorage.getItem('record'))
        record = localStorage.getItem('record')
    }
    afficherRecord.textContent=record
// Sauvegarder le score 
    let score             = 0
    if(localStorage.getItem('score')){
        console.log(localStorage.getItem('score'))
        score = localStorage.getItem('score')
    }
    afficherScore.textContent = score

function gerertheme(){

    // Mettre à jour les variables CSS en fonction du thème choisi
    if(body.classList.contains('mode-sombre')){

        body.className=''
        root.style.setProperty('--colorPrimaire','#dfddc7')
        root.style.setProperty('--colorQuaternaire','#211717')
        root.style.setProperty('--colorTertiaire','#a34a28')
        root.style.setProperty('--colorSecondaire','#f58b54')
        boutonMode.style.justifyContent='start'
        localStorage.setItem('theme','claire')
    }else {
       modeSombre()
    }

    // Ajoute ou supprime la classe 'mode-sombre' du body

}

function modeSombre(){

    body.className='mode-sombre'
    root.style.setProperty('--colorPrimaire','#211717')
    root.style.setProperty('--colorQuaternaire','#dfddc7')
    root.style.setProperty('--colorTertiaire','#f58b54')
    root.style.setProperty('--colorSecondaire','#a34a28')
    boutonMode.style.justifyContent='flex-end'
    localStorage.setItem('theme','sombre')
}
function afficherModal(){
    modal.style.display ='flex'
    backgroundModal.style.display ='block'
}
function fermerModal(){
    modal.style.display ='none'
    backgroundModal.style.display ='none'
}


// **********************jeu*****************************
let dernierIndex      = 0
let variableAleatoire = 0
let vies              = 7
let motChoisi         = ''
let description       = ''
let lettres           = ''
let jeuNonValide      = true
const audioBoutonValide    = new Audio('../audio/boutonValide.m4a')
const audioBoutonNonValide = new Audio('../audio/boutonNonValide.m4a')
const audioFelicitation    = new Audio('../audio/jeuGagne.mp3')
const audioDommage         = new Audio('../audio/jeuPerdu.mp3')
function genererNombreAleatoire( tableau){
    return  Math.floor(Math.random()* tableau)
}

function motTrouve(){
    afficherResultat.style.display ='flex'
    score++
    localStorage.setItem('score', score)
    if(score> record){
       record++
       afficherRecord.textContent = record
       localStorage.setItem('record', record)
    }
    afficherScore.textContent = score
    audioBoutonValide.pause()
    audioBoutonValide.currentTime =0
    audioFelicitation.play()
    h3.textContent     =`🎉🎉🎉🎉🎉 Félicitations 🎉🎉🎉🎉`
    p.textContent      = `Vous avez gagné ! Vous avez deviné le mot ${motChoisi}. Bravo pour cette performance impressionnante ! `
    boutonModalResultat.textContent = `Continuer`
}
function motNonTrouver(){
    afficherResultat.style.display ='flex'

    score = 0
    localStorage.setItem('score', score)
    afficherScore.textContent = score
    audioDommage.play()
    h3.textContent     =`😔😔 Dommage 😔😔`
    p.textContent      = `Vous avez perdu. Le mot était ${motChoisi}. Ne vous découragez pas, essayez à nouveau et vous finirez par réussir !  ! `
    boutonModalResultat.textContent = `Recommencer`

}


function recommencerJeu(){
    do{ 
        variableAleatoire = genererNombreAleatoire(mots.length)
    }while(variableAleatoire == dernierIndex)

    const motsEnMajuscules     = mots.map(mot => mot.toUpperCase())

    motChoisi            = motsEnMajuscules[variableAleatoire]
    description    = descriptions[variableAleatoire]
    afficherMotATrouver.innerHTML=''
    afficherDescription.innerHTML=''

    for(let i=0 ; i<motChoisi.length; i++) {
        const bouton        = document.createElement('button')
        bouton.textContent  = '_'
        afficherMotATrouver.appendChild(bouton)
    }
    lettres = document.querySelectorAll('.motATrouver button')
    afficherDescription.innerHTML=`" ${description} "` 
    console.log(motChoisi)
    clavier.forEach(bouton =>{
        bouton.classList.remove('boutonValide')
        bouton.classList.remove('boutonNonValide')
    })
    vies=7
    afficherVie.textContent=vies
}
function verifierJeu(){
    
    recommencerJeu()

    clavier.forEach(bouton =>{
       
        bouton.addEventListener('click', (event)=>{
            const bouton = event.target
            const lettre = bouton.value.toUpperCase()
            if(motChoisi.includes(lettre)){
                audioBoutonValide.play()
                bouton.classList.add('boutonValide')
                for(let i=0; i<motChoisi.length; i++){

                    if(motChoisi[i]===lettre){
                        console.log(lettres)

                        lettres[i].textContent=lettre
                        lettres[i].classList.add('boutonValide')
                    }
                }
                // Cette fonction returne true s'il y a un bouton qui contient '_' , et false s'il n'ya plus de bouton qui contient '_'
                jeuNonValide = Array.from(lettres).some(bouton => bouton.textContent ==='_')
                // si toutes les lettres sont trouvées, alors le joueur  a gagné
                console.log(jeuNonValide)
                if(!jeuNonValide){                    
                    motTrouve()
                }
            }else{
                audioBoutonNonValide.play()
                audioBoutonNonValide.volume = 0.6
                vies--
                afficherVie.textContent=vies
                // trouver comment faire la fonction recommencer mot, factoriser au maximun son code, revoir tout ce qui doit se repeter
                bouton.classList.add('boutonNonValide')
                console.log('la lettre ne figure pas')
                if(vies===0){
                    motNonTrouver()

                }
            }
        })
    })
   
    afficherVie.textContent=vies
    dernierIndex=variableAleatoire

}
verifierJeu()
// ************** Les evenements *************************
// Écouteur d'événement pour le bouton de commutation de thème
boutonMode.addEventListener('click', gerertheme)
boutonModalOK.addEventListener('click', fermerModal)
boutonModalNePlusAfficher.addEventListener('click', ()=>{
    localStorage.setItem('NePlusAfficher', 'true')
    fermerModal()
})
boutonRecommencer.addEventListener('click', verifierJeu)
boutonModalResultat.addEventListener('click', ()=>{
    audioFelicitation.pause()
    audioFelicitation.currentTime=0
    audioDommage.pause()
    audioDommage.currentTime=0
    afficherResultat.style.display ='none'
    recommencerJeu()
})
let variableAleatoireAchete , IndicesAchetes=[]
function genererNombreAleatoireAcheter(){
    return  Math.floor(Math.random()*motChoisi.length)
}
acheterUneLettre.addEventListener('click', ()=>{
    if(vies>2){
        vies-=2
        afficherVie.textContent = vies
        do{
            variableAleatoireAchete = genererNombreAleatoireAcheter()

        }while(IndicesAchetes.includes(variableAleatoireAchete))
        audioBoutonValide.play()
        lettres[variableAleatoireAchete].textContent= motChoisi[variableAleatoireAchete]
        lettres[variableAleatoireAchete].classList.add('boutonValide')
        IndicesAchetes.push(variableAleatoireAchete)
        console.log(variableAleatoireAchete)
        console.log(IndicesAchetes)

    }
    
})

// window.addEventListener('load', ()=>{
//     const cacherModal =
// })
