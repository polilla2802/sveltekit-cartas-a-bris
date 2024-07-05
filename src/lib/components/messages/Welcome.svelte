<script lang="ts">
  export let title: string = "Cartas a Bris";
</script>

<section class="page-title">
  <h1 class="text-center md:text-left smooth-underline">{title}</h1>
</section>

<style>
  .page-title {
    margin: 0 0 1rem 0;
    display: flex;
    justify-content: center;
  }

  h1 {
    font-family: Dancing;
    font-size: 2rem;
    font-weight: bolder;
    width: min-content;
    white-space: nowrap;
  }

  .smooth-underline {
    position: relative;
    text-decoration: none !important;
  }

  .smooth-underline::after {
    content: "";
    position: absolute;
    width: 50%;
    height: 2px;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    background-color: currentColor;
    transition: width 0.3s ease-in-out;
  }
</style>
