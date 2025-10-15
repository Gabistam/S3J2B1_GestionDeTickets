// Données des quiz avec explications
const quizData = {
    1: [
        {
            explanation: "Un ticket est une unité de travail dans un projet - il représente quelque chose à faire (bug, feature, tâche, etc.)."
        },
        {
            explanation: "En général, un bug (quelque chose qui ne fonctionne pas) est plus urgent qu'une amélioration d'une fonctionnalité existante."
        },
        {
            explanation: "Dans Trello, chaque ticket est représenté par une 'carte' (card) que l'on peut déplacer entre les listes."
        },
        {
            explanation: "GLPI est un outil professionnel spécialisé pour la gestion des incidents et du support IT en entreprise."
        },
        {
            explanation: "Bonne pratique : 1 ticket = 1 responsable unique. Cela évite la confusion et garantit la responsabilité."
        }
    ],
    2: [
        {
            explanation: "Trello est parfait pour la simplicité et le visuel (Kanban), tandis que Notion offre plus de puissance avec ses bases de données et vues multiples."
        },
        {
            explanation: "Le Sprint Backlog contient uniquement les tickets sélectionnés pour le sprint en cours, pas tous les tickets du projet."
        },
        {
            explanation: "Dans GLPI, un Incident est un symptôme (quelque chose ne marche pas), tandis qu'un Problème est la cause racine de plusieurs incidents."
        },
        {
            explanation: "La limite WIP (Work In Progress) recommandée est de 2-3 tickets maximum en cours par personne pour éviter le multitasking inefficace."
        },
        {
            explanation: "La vélocité mesure le nombre de story points complétés par sprint, permettant de prédire la capacité de l'équipe."
        }
    ],
    3: [
        {
            explanation: "Un bon titre doit être clair et descriptif - on doit comprendre l'essentiel du ticket sans avoir à l'ouvrir."
        },
        {
            explanation: "Pour un bug, les steps to reproduce (étapes pour reproduire) sont essentiels pour que le développeur puisse recréer le problème."
        },
        {
            explanation: "SMART signifie : Spécifique, Mesurable, Actionnable, Réaliste, Temporisé - critères d'un bon ticket."
        },
        {
            explanation: "Règle fondamentale : 1 ticket = 1 problème ou fonctionnalité. Sinon, créez plusieurs tickets et liez-les si nécessaire."
        },
        {
            explanation: "La Definition of Done définit les critères précis pour considérer un ticket complètement terminé (tests, review, déployement, etc.)."
        }
    ]
};

let quizScores = {};

// Fonction pour mélanger un tableau (Fisher-Yates shuffle)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Fonction pour randomiser les positions des réponses dans tous les quiz
function randomizeQuizAnswers() {
    document.querySelectorAll('[id^="quiz"]').forEach(quizElement => {
        const quizId = quizElement.id.replace('quiz', '');

        quizElement.querySelectorAll('.quiz-question').forEach((questionElement, questionIndex) => {
            const optionsContainer = questionElement.querySelector('.quiz-options');
            if (!optionsContainer) return;

            const buttons = Array.from(optionsContainer.querySelectorAll('.quiz-option'));
            if (buttons.length === 0) return;

            const buttonData = buttons.map(button => {
                const isCorrect = button.getAttribute('data-correct') === 'true';
                const text = button.textContent.trim();

                // Extraire la lettre et le contenu
                let letter = '';
                let content = text;
                if (text.match(/^[A-C]\)/)) {
                    letter = text.substring(0, 2);
                    content = text.substring(3);
                }

                return {
                    isCorrect: isCorrect,
                    content: content,
                    originalLetter: letter
                };
            });

            // Mélanger les données
            const shuffledData = shuffleArray(buttonData);

            // Remettre les boutons dans l'ordre mélangé avec nouvelles lettres
            const letters = ['A)', 'B)', 'C)'];
            optionsContainer.innerHTML = '';

            shuffledData.forEach((data, index) => {
                const newButton = document.createElement('button');
                newButton.className = 'quiz-option';
                newButton.setAttribute('data-correct', data.isCorrect);

                // Si c'était un vrai/faux, pas de lettre
                if (data.originalLetter) {
                    newButton.textContent = `${letters[index]} ${data.content}`;
                } else {
                    newButton.textContent = data.content;
                }

                newButton.onclick = function() {
                    selectAnswer(parseInt(quizId), questionIndex + 1, data.isCorrect, this);
                };
                optionsContainer.appendChild(newButton);
            });
        });
    });
}

function toggleIntro(introId) {
    const content = document.getElementById(`intro${introId}`);
    const arrow = content.previousElementSibling.querySelector('.intro-arrow');

    if (content.classList.contains('open')) {
        content.classList.remove('open');
        arrow.classList.remove('open');
    } else {
        content.classList.add('open');
        arrow.classList.add('open');
    }
}

function toggleQuiz(quizId) {
    const content = document.getElementById(`quiz${quizId}`);
    const arrow = content.previousElementSibling.querySelector('.quiz-arrow');

    if (content.classList.contains('open')) {
        content.classList.remove('open');
        arrow.classList.remove('open');
    } else {
        content.classList.add('open');
        arrow.classList.add('open');
    }
}

function selectAnswer(quizId, questionId, isCorrect, buttonElement) {
    const question = buttonElement.closest('.quiz-question');
    const options = question.querySelectorAll('.quiz-option');
    const feedback = question.querySelector('.quiz-feedback');
    const feedbackText = feedback.querySelector('.feedback-text');

    // Désactiver tous les boutons
    options.forEach(option => {
        option.style.pointerEvents = 'none';
        const optionIsCorrect = option.getAttribute('data-correct') === 'true';
        if (optionIsCorrect) {
            option.classList.add('correct');
        } else if (option === buttonElement && !isCorrect) {
            option.classList.add('incorrect');
        }
    });

    // Afficher le feedback
    const data = quizData[quizId][questionId - 1];
    feedbackText.innerHTML = `<strong>${isCorrect ? '✅ Correct !' : '❌ Incorrect.'}</strong><br>${data.explanation}`;
    feedback.classList.add('show');
    feedback.classList.add(isCorrect ? 'feedback-correct' : 'feedback-incorrect');

    // Comptabiliser le score
    if (!quizScores[quizId]) {
        quizScores[quizId] = { correct: 0, total: 0 };
    }

    if (isCorrect) {
        quizScores[quizId].correct++;
    }
    quizScores[quizId].total++;

    // Afficher le score si toutes les questions sont répondues
    if (quizScores[quizId].total === 5) {
        setTimeout(() => showQuizScore(quizId), 1000);
    }
}

function showQuizScore(quizId) {
    const score = quizScores[quizId];
    const scoreElement = document.querySelector(`#quiz${quizId} .quiz-score`);
    const scoreText = scoreElement.querySelector('.score-text');
    const percentage = Math.round((score.correct / score.total) * 100);

    let message = '';
    let emoji = '';

    if (percentage >= 80) {
        emoji = '🏆';
        message = 'Excellent ! Vous maîtrisez parfaitement les concepts de gestion de tickets.';
    } else if (percentage >= 60) {
        emoji = '👍';
        message = 'Bon travail ! Relisez les sections où vous avez eu des difficultés.';
    } else {
        emoji = '📚';
        message = 'Il faut réviser ce chapitre. Relisez attentivement le cours.';
    }

    scoreText.innerHTML = `${emoji} Score : ${score.correct}/${score.total} (${percentage}%)<br><br>${message}`;
    scoreElement.classList.add('show');
}

function toggleCheckbox(item) {
    const checkbox = item.querySelector('.checkbox');
    checkbox.classList.toggle('checked');

    if (checkbox.classList.contains('checked')) {
        item.style.transform = 'translateX(10px)';
        setTimeout(() => {
            item.style.transform = 'translateX(0)';
        }, 200);
    }
}

function smoothScroll() {
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const navHeight = document.querySelector('.nav-fixed').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

function updateActiveNav() {
    const sections = document.querySelectorAll('.section, #intro');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navHeight = document.querySelector('.nav-fixed').offsetHeight;

    function highlightNavigation() {
        let current = '';
        const scrollPosition = window.pageYOffset + navHeight + 50;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id');
            }
        });

        if (window.pageYOffset < 100) {
            current = 'intro';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(highlightNavigation);
    });

    highlightNavigation();
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Randomiser les réponses des quiz
    randomizeQuizAnswers();

    // Activer le smooth scroll
    smoothScroll();

    // Activer la navigation active
    updateActiveNav();

    // Message de confirmation
    setTimeout(() => {
        console.log('🎫 Cours Gestion de Tickets chargé avec succès !');
        console.log('🎲 Les réponses des quiz ont été randomisées.');
    }, 1000);
});
