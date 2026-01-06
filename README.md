# AEQ_WEB — Site vitrine accessible (projet étudiant)

## Présentation
Ce projet est un site web vitrine réalisé dans un cadre pédagogique.  
Il présente une marque fictive de bracelets artisanaux en bois appelée **Bois Noble**.

L’objectif principal est de concevoir un site :
- structuré et maintenable,
- accessible (bonnes pratiques RGAA / WCAG),
- cohérent sur le plan graphique,
- fonctionnel sans framework.

---

## Technologies utilisées
- **HTML5** (structure sémantique)
- **CSS3** (mise en forme, responsive)
- **JavaScript (vanilla)**  
- **JSON** (données produits)
- Aucun framework ou bibliothèque externe

## Organisation du code

### HTML
- Une page = un fichier
- Structure commune sur toutes les pages :
  - `header` (navigation)
  - `main` (contenu principal)
  - `footer`
- Utilisation de balises sémantiques (`section`, `article`, `nav`, `figure`)
- Présence d’un lien d’évitement (`skip-link`) sur chaque page

### CSS
- Un seul fichier `style.css`
- Organisation logique :
  1. Variables et styles de base
  2. Layout global
  3. Navigation et header
  4. Composants UI (cartes, boutons, formulaires)
  5. Styles spécifiques par page (collection, produit, contact, etc.)
- Pas de styles dupliqués ou inutiles

### JavaScript
- Un seul fichier `script.js`
- Code structuré par fonctionnalités :
  - Génération de la collection produits
  - Génération de la fiche produit
  - Gestion du formulaire de contact
  - Menu mobile et modale
- Aucune exécution hors `DOMContentLoaded`

## Gestion des produits
Les produits sont définis dans :


Chaque produit contient :
- un identifiant unique (`id`)
- une essence de bois
- un prix
- une image
- une description courte (collection)
- une description détaillée (fiche produit)

La page **collection** et la **fiche produit** sont générées dynamiquement à partir de ce fichier.

---

## Accessibilité
Le projet applique les bonnes pratiques suivantes :
- Navigation complète au clavier
- Focus visible
- Titres hiérarchisés
- Formulaires accessibles (labels, messages d’erreur)
- Images avec textes alternatifs
- Menu mobile accessible (gestion du focus et de la touche Escape)
- Page dédiée à la déclaration d’accessibilité

---

## Lancement du projet
Le site doit être lancé via un serveur local (ex. **Live Server** sur VS Code)  
afin de permettre le chargement du fichier JSON.

---

## Auteur
Projet réalisé par un étudiant dans un cadre pédagogique.  
Toutes les données, marques et contenus sont fictifs.

---

## Remarque finale
Ce projet privilégie la clarté, la structure et l’accessibilité  
plutôt que l’utilisation de solutions complexes ou de frameworks.
