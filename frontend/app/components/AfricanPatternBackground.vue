<template>
    <div class="african-pattern-background" :class="[`opacity-${opacity}`, `color-${color}`]"></div>
</template>

<script setup lang="ts">
interface Props {
    opacity?: 'light' | 'medium' | 'strong'
    color?: 'gold' | 'green' | 'terracotta'
}

const props = withDefaults(defineProps<Props>(), {
    opacity: 'medium',
    color: 'gold'
})
</script>

<style scoped>
.african-pattern-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
}

/* Motif avec couleur Or Brossé (par défaut) */
.african-pattern-background.color-gold {
    background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cdefs%3E%3Cpattern id='chevron-pattern-gold' x='0' y='0' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Cg fill='none' stroke='%23C9A46C' stroke-width='2'%3E%3Cpolyline points='5,15 15,25 5,35' opacity='0.25'/%3E%3Cpolyline points='5,35 15,45 5,55' opacity='0.25'/%3E%3Cpolyline points='5,55 15,65 5,75' opacity='0.25'/%3E%3Cpolyline points='75,15 65,25 75,35' opacity='0.25'/%3E%3Cpolyline points='75,35 65,45 75,55' opacity='0.25'/%3E%3Cpolyline points='75,55 65,65 75,75' opacity='0.25'/%3E%3Cline x1='20' y1='10' x2='28' y2='18' opacity='0.2'/%3E%3Cline x1='24' y1='10' x2='32' y2='18' opacity='0.2'/%3E%3Cline x1='28' y1='10' x2='36' y2='18' opacity='0.2'/%3E%3Cline x1='20' y1='30' x2='28' y2='38' opacity='0.2'/%3E%3Cline x1='24' y1='30' x2='32' y2='38' opacity='0.2'/%3E%3Cline x1='28' y1='30' x2='36' y2='38' opacity='0.2'/%3E%3Cline x1='20' y1='50' x2='28' y2='58' opacity='0.2'/%3E%3Cline x1='24' y1='50' x2='32' y2='58' opacity='0.2'/%3E%3Cline x1='28' y1='50' x2='36' y2='58' opacity='0.2'/%3E%3Cline x1='20' y1='70' x2='28' y2='78' opacity='0.2'/%3E%3Cline x1='24' y1='70' x2='32' y2='78' opacity='0.2'/%3E%3Cline x1='28' y1='70' x2='36' y2='78' opacity='0.2'/%3E%3Cline x1='52' y1='10' x2='44' y2='18' opacity='0.2'/%3E%3Cline x1='56' y1='10' x2='48' y2='18' opacity='0.2'/%3E%3Cline x1='60' y1='10' x2='52' y2='18' opacity='0.2'/%3E%3Cline x1='52' y1='30' x2='44' y2='38' opacity='0.2'/%3E%3Cline x1='56' y1='30' x2='48' y2='38' opacity='0.2'/%3E%3Cline x1='60' y1='30' x2='52' y2='38' opacity='0.2'/%3E%3Cline x1='52' y1='50' x2='44' y2='58' opacity='0.2'/%3E%3Cline x1='56' y1='50' x2='48' y2='58' opacity='0.2'/%3E%3Cline x1='60' y1='50' x2='52' y2='58' opacity='0.2'/%3E%3Cline x1='52' y1='70' x2='44' y2='78' opacity='0.2'/%3E%3Cline x1='56' y1='70' x2='48' y2='78' opacity='0.2'/%3E%3Cline x1='60' y1='70' x2='52' y2='78' opacity='0.2'/%3E%3Ccircle cx='40' cy='15' r='1.5' fill='%23C9A46C' opacity='0.3'/%3E%3Ccircle cx='40' cy='25' r='1.5' fill='%23C9A46C' opacity='0.3'/%3E%3Ccircle cx='40' cy='35' r='1.5' fill='%23C9A46C' opacity='0.3'/%3E%3Ccircle cx='40' cy='45' r='1.5' fill='%23C9A46C' opacity='0.3'/%3E%3Ccircle cx='40' cy='55' r='1.5' fill='%23C9A46C' opacity='0.3'/%3E%3Ccircle cx='40' cy='65' r='1.5' fill='%23C9A46C' opacity='0.3'/%3E%3Ccircle cx='40' cy='75' r='1.5' fill='%23C9A46C' opacity='0.3'/%3E%3Cline x1='10' y1='0' x2='10' y2='80' opacity='0.15'/%3E%3Cline x1='14' y1='0' x2='14' y2='80' opacity='0.15'/%3E%3Cline x1='66' y1='0' x2='66' y2='80' opacity='0.15'/%3E%3Cline x1='70' y1='0' x2='70' y2='80' opacity='0.15'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23chevron-pattern-gold)'/%3E%3C/svg%3E");
}

/* Motif avec couleur Vert Ébène */
.african-pattern-background.color-green {
    background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cdefs%3E%3Cpattern id='chevron-pattern-green' x='0' y='0' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Cg fill='none' stroke='%230E3A34' stroke-width='2'%3E%3Cpolyline points='5,15 15,25 5,35' opacity='0.25'/%3E%3Cpolyline points='5,35 15,45 5,55' opacity='0.25'/%3E%3Cpolyline points='5,55 15,65 5,75' opacity='0.25'/%3E%3Cpolyline points='75,15 65,25 75,35' opacity='0.25'/%3E%3Cpolyline points='75,35 65,45 75,55' opacity='0.25'/%3E%3Cpolyline points='75,55 65,65 75,75' opacity='0.25'/%3E%3Cline x1='20' y1='10' x2='28' y2='18' opacity='0.2'/%3E%3Cline x1='24' y1='10' x2='32' y2='18' opacity='0.2'/%3E%3Cline x1='28' y1='10' x2='36' y2='18' opacity='0.2'/%3E%3Cline x1='20' y1='30' x2='28' y2='38' opacity='0.2'/%3E%3Cline x1='24' y1='30' x2='32' y2='38' opacity='0.2'/%3E%3Cline x1='28' y1='30' x2='36' y2='38' opacity='0.2'/%3E%3Cline x1='20' y1='50' x2='28' y2='58' opacity='0.2'/%3E%3Cline x1='24' y1='50' x2='32' y2='58' opacity='0.2'/%3E%3Cline x1='28' y1='50' x2='36' y2='58' opacity='0.2'/%3E%3Cline x1='20' y1='70' x2='28' y2='78' opacity='0.2'/%3E%3Cline x1='24' y1='70' x2='32' y2='78' opacity='0.2'/%3E%3Cline x1='28' y1='70' x2='36' y2='78' opacity='0.2'/%3E%3Cline x1='52' y1='10' x2='44' y2='18' opacity='0.2'/%3E%3Cline x1='56' y1='10' x2='48' y2='18' opacity='0.2'/%3E%3Cline x1='60' y1='10' x2='52' y2='18' opacity='0.2'/%3E%3Cline x1='52' y1='30' x2='44' y2='38' opacity='0.2'/%3E%3Cline x1='56' y1='30' x2='48' y2='38' opacity='0.2'/%3E%3Cline x1='60' y1='30' x2='52' y2='38' opacity='0.2'/%3E%3Cline x1='52' y1='50' x2='44' y2='58' opacity='0.2'/%3E%3Cline x1='56' y1='50' x2='48' y2='58' opacity='0.2'/%3E%3Cline x1='60' y1='50' x2='52' y2='58' opacity='0.2'/%3E%3Cline x1='52' y1='70' x2='44' y2='78' opacity='0.2'/%3E%3Cline x1='56' y1='70' x2='48' y2='78' opacity='0.2'/%3E%3Cline x1='60' y1='70' x2='52' y2='78' opacity='0.2'/%3E%3Ccircle cx='40' cy='15' r='1.5' fill='%230E3A34' opacity='0.3'/%3E%3Ccircle cx='40' cy='25' r='1.5' fill='%230E3A34' opacity='0.3'/%3E%3Ccircle cx='40' cy='35' r='1.5' fill='%230E3A34' opacity='0.3'/%3E%3Ccircle cx='40' cy='45' r='1.5' fill='%230E3A34' opacity='0.3'/%3E%3Ccircle cx='40' cy='55' r='1.5' fill='%230E3A34' opacity='0.3'/%3E%3Ccircle cx='40' cy='65' r='1.5' fill='%230E3A34' opacity='0.3'/%3E%3Ccircle cx='40' cy='75' r='1.5' fill='%230E3A34' opacity='0.3'/%3E%3Cline x1='10' y1='0' x2='10' y2='80' opacity='0.15'/%3E%3Cline x1='14' y1='0' x2='14' y2='80' opacity='0.15'/%3E%3Cline x1='66' y1='0' x2='66' y2='80' opacity='0.15'/%3E%3Cline x1='70' y1='0' x2='70' y2='80' opacity='0.15'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23chevron-pattern-green)'/%3E%3C/svg%3E");
}

/* Motif avec couleur Terracotta */
.african-pattern-background.color-terracotta {
    background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cdefs%3E%3Cpattern id='chevron-pattern-terracotta' x='0' y='0' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Cg fill='none' stroke='%23A14E36' stroke-width='2'%3E%3Cpolyline points='5,15 15,25 5,35' opacity='0.25'/%3E%3Cpolyline points='5,35 15,45 5,55' opacity='0.25'/%3E%3Cpolyline points='5,55 15,65 5,75' opacity='0.25'/%3E%3Cpolyline points='75,15 65,25 75,35' opacity='0.25'/%3E%3Cpolyline points='75,35 65,45 75,55' opacity='0.25'/%3E%3Cpolyline points='75,55 65,65 75,75' opacity='0.25'/%3E%3Cline x1='20' y1='10' x2='28' y2='18' opacity='0.2'/%3E%3Cline x1='24' y1='10' x2='32' y2='18' opacity='0.2'/%3E%3Cline x1='28' y1='10' x2='36' y2='18' opacity='0.2'/%3E%3Cline x1='20' y1='30' x2='28' y2='38' opacity='0.2'/%3E%3Cline x1='24' y1='30' x2='32' y2='38' opacity='0.2'/%3E%3Cline x1='28' y1='30' x2='36' y2='38' opacity='0.2'/%3E%3Cline x1='20' y1='50' x2='28' y2='58' opacity='0.2'/%3E%3Cline x1='24' y1='50' x2='32' y2='58' opacity='0.2'/%3E%3Cline x1='28' y1='50' x2='36' y2='58' opacity='0.2'/%3E%3Cline x1='20' y1='70' x2='28' y2='78' opacity='0.2'/%3E%3Cline x1='24' y1='70' x2='32' y2='78' opacity='0.2'/%3E%3Cline x1='28' y1='70' x2='36' y2='78' opacity='0.2'/%3E%3Cline x1='52' y1='10' x2='44' y2='18' opacity='0.2'/%3E%3Cline x1='56' y1='10' x2='48' y2='18' opacity='0.2'/%3E%3Cline x1='60' y1='10' x2='52' y2='18' opacity='0.2'/%3E%3Cline x1='52' y1='30' x2='44' y2='38' opacity='0.2'/%3E%3Cline x1='56' y1='30' x2='48' y2='38' opacity='0.2'/%3E%3Cline x1='60' y1='30' x2='52' y2='38' opacity='0.2'/%3E%3Cline x1='52' y1='50' x2='44' y2='58' opacity='0.2'/%3E%3Cline x1='56' y1='50' x2='48' y2='58' opacity='0.2'/%3E%3Cline x1='60' y1='50' x2='52' y2='58' opacity='0.2'/%3E%3Cline x1='52' y1='70' x2='44' y2='78' opacity='0.2'/%3E%3Cline x1='56' y1='70' x2='48' y2='78' opacity='0.2'/%3E%3Cline x1='60' y1='70' x2='52' y2='78' opacity='0.2'/%3E%3Ccircle cx='40' cy='15' r='1.5' fill='%23A14E36' opacity='0.3'/%3E%3Ccircle cx='40' cy='25' r='1.5' fill='%23A14E36' opacity='0.3'/%3E%3Ccircle cx='40' cy='35' r='1.5' fill='%23A14E36' opacity='0.3'/%3E%3Ccircle cx='40' cy='45' r='1.5' fill='%23A14E36' opacity='0.3'/%3E%3Ccircle cx='40' cy='55' r='1.5' fill='%23A14E36' opacity='0.3'/%3E%3Ccircle cx='40' cy='65' r='1.5' fill='%23A14E36' opacity='0.3'/%3E%3Ccircle cx='40' cy='75' r='1.5' fill='%23A14E36' opacity='0.3'/%3E%3Cline x1='10' y1='0' x2='10' y2='80' opacity='0.15'/%3E%3Cline x1='14' y1='0' x2='14' y2='80' opacity='0.15'/%3E%3Cline x1='66' y1='0' x2='66' y2='80' opacity='0.15'/%3E%3Cline x1='70' y1='0' x2='70' y2='80' opacity='0.15'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23chevron-pattern-terracotta)'/%3E%3C/svg%3E");
}

/* Niveaux d'opacité */
.african-pattern-background.opacity-light {
    opacity: 0.5;
}

.african-pattern-background.opacity-medium {
    opacity: 1;
}

.african-pattern-background.opacity-strong {
    opacity: 1.5;
}

/* Configuration du background */
.african-pattern-background {
    background-size: cover;
    background-position: center;
    background-repeat: repeat;
}
</style>
