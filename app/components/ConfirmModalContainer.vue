<template>
  <ConfirmModal
    :show="showModal"
    :title="modalOptions.title"
    :message="modalOptions.message"
    :confirmText="modalOptions.confirmText"
    :cancelText="modalOptions.cancelText"
    :type="modalOptions.type"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { useConfirm } from '../../composables/useConfirm'
import ConfirmModal from './ConfirmModal.vue'

const { showModal, modalOptions, handleConfirm, handleCancel } = useConfirm()
</script>
