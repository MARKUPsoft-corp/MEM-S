<template>
  <div class="container py-5">
    <h1 class="mb-4">Contactez-nous</h1>
    <div class="row">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-4">Informations de contact</h5>
            
            <div class="mb-3">
              <i class="bi bi-whatsapp text-success fs-5"></i>
              <span class="ms-2">{{ config.public.whatsappNumber }}</span>
            </div>
            
            <div class="mb-3">
              <i class="bi bi-envelope fs-5"></i>
              <span class="ms-2">contact@mensmarkup.com</span>
            </div>
            
            <div class="mb-3">
              <i class="bi bi-geo-alt fs-5"></i>
              <span class="ms-2">Cameroun</span>
            </div>
            
            <hr>
            
            <h6 class="mb-3">Suivez-nous</h6>
            <div class="d-flex gap-3">
              <a href="#" class="text-dark fs-4"><i class="bi bi-facebook"></i></a>
              <a href="#" class="text-dark fs-4"><i class="bi bi-instagram"></i></a>
              <a href="#" class="text-dark fs-4"><i class="bi bi-twitter"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

definePageMeta({
  layout: 'default'
})
</script>
