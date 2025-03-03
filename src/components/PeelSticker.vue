<template>
  <div id="stickerPeel" class="anim750 no-hover-scale" @click="$emit('click')">
    <div class="reveal squareRounded_wrapper">
      <div class="squareRounded">{{ revealText }}</div>
    </div>

    <div class="sticky anim750">
      <div class="front squareRounded_wrapper anim750">
        <div class="squareRounded anim750"></div>
      </div>
    </div>

    <h4>{{ labelText }}</h4>

    <div class="sticky anim750">
      <div class="back squareRounded_wrapper anim750">
        <div class="squareRounded anim750"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  revealText: {
    type: String,
    default: 'Hello!'
  },
  labelText: {
    type: String,
    default: 'Peel'
  },
  backgroundColor: {
    type: String,
    default: '#fbec3f'
  },
  size: {
    type: Number,
    default: 180
  }
})

defineEmits(['click'])
</script>


<style lang="scss" scoped>
.anim750 {
  transition: all 750ms ease-in-out;
}

#stickerPeel {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
  backface-visibility: hidden;
  cursor: pointer;
  transform: none !important;
}

#stickerPeel .sticky {
  transform: rotate(0deg);
  position: absolute;
  top: 0;
  left: 0;
  width: 180px;
  height: 180px;
}

#stickerPeel:hover .sticky {
  transform: rotate(0deg);
}

#stickerPeel .reveal .squareRounded {
  box-shadow: 0 1px 0px rgba(0,0,0,.15);
  font-family: 'helvetica neue', arial;
  font-weight: 200;
  line-height: 140px;
  text-align: center;
  background:  rgba(200,200,200,.2);
  color: var(--color-text);
}

#stickerPeel .squareRounded_wrapper {
  position: absolute;
  width: 180px;
  height: 180px;
  left: 0px;
  top: 0px;
  overflow: hidden;
}

#stickerPeel .squareRounded {
  position: absolute;
  width: 140px;
  height: 140px;
  margin: 20px;
  border-radius: 30px;
}

#stickerPeel .back {
  height: 10px;
  top: 30px;
}

#stickerPeel:hover .back {
  height: 90px;
  top: 110px;
}

#stickerPeel .back .squareRounded {
  margin-top: -130px;
  background-color: #fbec3f;
  background-image: linear-gradient(to top, rgba(251,236,63,.0), rgba(255,255,255,.8));
}

#stickerPeel:hover .back .squareRounded {
  margin-top: -50px;
}

#stickerPeel .front {
  height: 150px;
  bottom: 0;
  top: auto;
  box-shadow: 0 -140px 20px -140px rgba(0,0,0,.3);
}

#stickerPeel:hover .front {
  height: 70px;
  box-shadow: 0 -60px 10px -60px rgba(0,0,0,.1);
}

#stickerPeel .front .squareRounded {
  margin-top: -10px;
  background: #fbec3f;
  background-image: linear-gradient(to top,
    rgba(251,236,63,.0) 75%,
    #f7bb37 95%
  );
}

#stickerPeel:hover .front .squareRounded {
  margin-top: -90px;
  background-color: #e2d439;
  background-position: 0 100px;
}

#stickerPeel h4 {
  font-family: 'helvetica neue', arial;
  font-weight: 200;
  text-align: center;
  position: absolute;
  width: 180px;
  height: 140px;
  line-height: 140px;
  transition: opacity 50ms linear 400ms;
}

#stickerPeel:hover h4 {
  opacity: 0;
  transition: opacity 50ms linear 300ms;
}
</style>
