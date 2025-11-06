<template>
    <section class="about-section">
        <div class="container">
            <div class="about-content">
                <!-- Left Side - Image -->
                <div class="about-image">
                    <div class="image-wrapper">
                        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop&q=80"
                            alt="MEM'S - Élégance Africaine" class="main-image" />
                        <div class="image-overlay"></div>
                    </div>
                </div>

                <!-- Right Side - Content -->
                <div class="about-text">
                    <div class="section-header">
                        <h2 class="section-title">À Propos de Nous</h2>
                        <div class="title-underline"></div>
                    </div>

                    <p class="lead-text">
                        MEM'S est votre destination pour des vêtements alliant élégance intemporelle et inspiration
                        africaine.
                    </p>

                    <p class="body-text">
                        Nous célébrons le raffinement contemporain et les racines culturelles à travers une sélection
                        soigneusement choisie de boubous, gandouras, costumes, babouches et vêtements en lin naturel.
                    </p>

                    <p class="body-text">
                        Chaque pièce de notre collection est sélectionnée avec soin pour offrir qualité, confort et
                        authenticité. Nous croyons que la mode est un moyen d'expression culturelle et d'affirmation de
                        soi.
                    </p>

                    <!-- Values -->
                    <div class="values-grid">
                        <div class="value-item">
                            <div class="value-icon">
                                <i class="bi bi-gem"></i>
                            </div>
                            <h3 class="value-title">Qualité Premium</h3>
                            <p class="value-text">Des matériaux nobles et un savoir-faire artisanal</p>
                        </div>

                        <div class="value-item">
                            <div class="value-icon">
                                <i class="bi bi-heart"></i>
                            </div>
                            <h3 class="value-title">Authenticité</h3>
                            <p class="value-text">Des créations qui célèbrent l'héritage africain</p>
                        </div>

                        <div class="value-item">
                            <div class="value-icon">
                                <i class="bi bi-star"></i>
                            </div>
                            <h3 class="value-title">Excellence</h3>
                            <p class="value-text">Un service client attentif et personnalisé</p>
                        </div>
                    </div>

                    <!-- CTA Button -->
                    <div class="about-cta">
                        <NuxtLink to="/about" class="btn-learn-more">
                            En savoir plus
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
// Pas de logique nécessaire pour cette section statique
</script>

<style scoped>
.about-section {
    padding: 5rem 0;
    background: #F5F2EC;
    position: relative;
}

.about-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 2rem);
    max-width: 1400px;
    height: 1px;
    background: linear-gradient(to right,
            transparent 0%,
            #C9A46C 20%,
            #C9A46C 80%,
            transparent 100%);
    opacity: 0.4;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* Content Layout */
.about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

/* Left Side - Image */
.about-image {
    position: relative;
}

.image-wrapper {
    position: relative;
    width: 100%;
    padding-top: 125%;
    /* Ratio 4:5 */
    overflow: hidden;
    border-radius: 4px;
}

.main-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom,
            transparent 0%,
            rgba(14, 58, 52, 0.1) 100%);
    pointer-events: none;
}

/* Right Side - Content */
.about-text {
    padding: 2rem 0;
}

.section-header {
    margin-bottom: 2rem;
}

.section-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 2.5rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0 0 1rem 0;
    letter-spacing: 1px;
}

.title-underline {
    width: 80px;
    height: 3px;
    background: #C9A46C;
    border-radius: 2px;
}

.lead-text {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.25rem;
    font-weight: 500;
    color: #0B0B0B;
    line-height: 1.6;
    margin: 0 0 1.5rem 0;
}

.body-text {
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    color: #2A2A2A;
    line-height: 1.8;
    margin: 0 0 1.25rem 0;
}

/* Values Grid */
.values-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin: 3rem 0;
}

.value-item {
    text-align: center;
}

.value-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F5F2EC;
    border-radius: 50%;
    color: #0E3A34;
    font-size: 1.5rem;
    transition: all 0.3s ease;
}

.value-item:hover .value-icon {
    background: #0E3A34;
    color: #F5F2EC;
    transform: scale(1.1);
}

.value-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: #0B0B0B;
    margin: 0 0 0.5rem 0;
}

.value-text {
    font-family: 'Montserrat', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    color: #2A2A2A;
    line-height: 1.5;
    margin: 0;
}

/* CTA Button */
.about-cta {
    margin-top: 2.5rem;
}

.btn-learn-more {
    display: inline-block;
    padding: 1rem 3rem;
    background: #0E3A34;
    color: #F5F2EC;
    border: 2px solid #0E3A34;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Montserrat', sans-serif;
    border-radius: 2px;
    text-decoration: none;
}

.btn-learn-more:hover {
    background: transparent;
    color: #0E3A34;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 58, 52, 0.2);
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
    .about-content {
        grid-template-columns: 1fr;
        gap: 2.5rem;
    }

    .about-text {
        padding: 0;
    }

    .section-title {
        font-size: 2.25rem;
    }

    .lead-text {
        font-size: 1.125rem;
    }

    .values-grid {
        gap: 1.5rem;
    }
}

/* Responsive - Mobile */
@media (max-width: 767px) {
    .about-section {
        padding: 3rem 0;
    }

    .about-content {
        grid-template-columns: 1fr;
        gap: 2.5rem;
    }

    .about-text {
        padding: 0;
    }

    .section-title {
        font-size: 2rem;
    }

    .lead-text {
        font-size: 1.0625rem;
    }

    .body-text {
        font-size: 0.9375rem;
    }

    .values-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
        margin: 2.5rem 0;
    }

    .value-icon {
        width: 50px;
        height: 50px;
        font-size: 1.25rem;
    }

    .btn-learn-more {
        padding: 0.875rem 2rem;
        font-size: 0.8125rem;
        letter-spacing: 1px;
        width: 100%;
        text-align: center;
    }
}
</style>
