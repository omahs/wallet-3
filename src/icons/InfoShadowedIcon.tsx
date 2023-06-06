import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import colors from 'src/styles/colors'

interface Props {
  width?: number
  height?: number
  testID?: string
  color?: string
  backgroundShapeColor?: string
}

function InfoShadowedIcon({
  width = 88,
  height = 88,
  testID = 'InfoShadowedIcon',
  backgroundShapeColor = colors.pink,
  color = colors.dark,
}: Props) {
  return (
    <Svg width={width} height={height} fill="none" testID={testID}>
      <Path
        fill={backgroundShapeColor}
        fillRule="evenodd"
        d="M55.644 82.312c-6.312 1.605-13.206 3.63-19.103 1.09-5.857-2.523-8.366-8.932-11.527-14.282-2.897-4.904-5.555-9.887-6.087-15.53-.554-5.886.201-11.885 3.003-17.202 2.927-5.553 7.412-10.324 13.092-13.34 5.798-3.08 12.53-4.675 19.021-3.717 6.325.934 11.258 5.135 16.245 8.925 5.006 3.805 10.424 7.461 12.81 13.156 2.458 5.87 2.6 12.606.523 18.679-2.014 5.89-6.82 10.376-11.816 14.344-4.756 3.778-10.213 6.365-16.16 7.877Z"
        clipRule="evenodd"
      />
      <Path
        fill={color}
        d="m8.75 44.084.088.177c.088 2.764-.077.814.088 3.37.11.495.263 1.54.395 2.587.132 1.046.396 2.048.506 2.466 0 0 .263 1.211.22 1.101.175.353.384 1.234.626 1.993.11.264 0-.209-.077-.418.163.578.365 1.144.604 1.696.23.671.253.847 0 .132a34.477 34.477 0 0 0 2.703 5.802 32.993 32.993 0 0 0 13.975 13.456l1.878.903 1.715.66c.827.332 1.675.612 2.537.838a19.174 19.174 0 0 0-1.373-.441 12.7 12.7 0 0 1-1.274-.55c.798.317 1.616.582 2.45.792.553.23 1.122.417 1.703.562.79.176 1.637.363 2.12.528h.44c.208.066.428.1.648.154 1.171.18 2.353.286 3.537.32h.638c.805.05 1.612.05 2.417 0a27.187 27.187 0 0 0 3.57-.286c.945-.1 1.714-.265 2.55-.397-.253 0-.913.11-.144 0 .814-.124 1.62-.29 2.418-.495l1.757-.474c.583-.198.956-.363.55-.264.406-.1 2.516-.826 1.285-.352l1.022-.353.846-.396-.89.374c1.165-.528 2.066-.903 2.857-1.277.79-.374 1.428-.793 2.13-1.222l-.834.418c1.351-.694 2.34-1.508 2.9-1.75l-1.285.902a25 25 0 0 0 2.593-1.85 23.072 23.072 0 0 0 2.197-1.938l-.538.518 1.099-1.101a18.522 18.522 0 0 0 1.549-1.674 33.523 33.523 0 0 0 3.383-4.69 34.622 34.622 0 0 0 3.802-8.59l-.407 1.102.594-2.004c-.077.231-.11 1.024-.198 1.211.275-.787.506-1.588.692-2.4.12-.529.264-1.101.418-1.729l.33-2.037c.457-3.264.486-6.573.087-9.844A31.7 31.7 0 0 0 77 30.189l-.472-1.003-.484-.858-.857-1.52-1.34-1.982c-.978-1.365-.088-.308-.066-.308-1.252-1.586-.55-.65-1.648-2.004-.297-.386.1 0 .275.242a9.364 9.364 0 0 0-1.022-1.101c.626.716.297.462.527.804l-1.494-1.674h.11c-.33-.385-.978-.804-2.549-2.323a43.007 43.007 0 0 0-9.371-6.376c.066 0 .758.353 1.46.705-.439-.242-1.098-.595-1.504-.826.373.242 0 .055-.341-.12-.34-.177-.78-.342-.461-.188a34.082 34.082 0 0 0-8.24-2.566l-.934.21-.846.176-.934.308c-.626.21-1.22.418-1.66.595-.249.107-.485.244-.702.407l-1.571.077c.186 0 1.516 0 2.197-.099a.376.376 0 0 1 .12-.077c1.66.066.385.066 2 .143a2.763 2.763 0 0 1-.835 0 13.045 13.045 0 0 0-1.856 0 9.138 9.138 0 0 1 1.659 0h1.098c1.099.143-.132 0 1.187.264.461.066 1.01.121 1.571.22.56.1 1.099.276 1.659.43.584.154 1.16.338 1.725.55l1.472.496c1.019.445 2.013.945 2.977 1.498l-.252-.11c.758.44 2.318 1.189 3.614 2.092-.373-.243-.68-.485.121 0 .802.484 1.396.913 2.01 1.32.558.377 1.086.793 1.583 1.245l1.022.76c.626.484 1.373 1.277 2.34 2.202a42.391 42.391 0 0 1 2.977 3.303 28.65 28.65 0 0 1 5.153 9.712 33.412 33.412 0 0 1 1.274 11.011 37.901 37.901 0 0 1-1.22 7.576v-.242a36.38 36.38 0 0 1-3.295 8.192 32.37 32.37 0 0 1-6.68 8.401 31.068 31.068 0 0 1-9.152 5.649 34.643 34.643 0 0 1-8.79 2.202c-1.756.168-3.52.22-5.284.154.89.078.582.1-.12 0-2.462-.099-2.539-.187-2.627-.165a21.8 21.8 0 0 1-2.658-.363 26.326 26.326 0 0 1-2.78-.628l-1.802-.517-1.966-.75a31.076 31.076 0 0 1-14.668-12.331 34.637 34.637 0 0 1-2.856-5.77 32.503 32.503 0 0 1-2.318-8.523l.055.264c-.055-.363-.143-.925-.231-1.651-.088-.727-.099-1.608-.154-2.61a34.621 34.621 0 0 1 .56-6.75 31.558 31.558 0 0 1 1.967-6.606l1.165-2.434.922-1.563-.241.385c.412-.776.894-1.513 1.44-2.202.362-.43.592-.837 1.372-1.696a12.525 12.525 0 0 1 2-2.444 35.258 35.258 0 0 1 5.383-4.625l-.055.088a35.132 35.132 0 0 1 6.296-3.402 35.947 35.947 0 0 1 12.327-2.61c.937.023 1.872.097 2.802.22h.406a5.321 5.321 0 0 0 1.659-.781c.483-.43.286-1.013-2.769-1.465h.1-3.242 1.989c-1.461 0-.44 0 .12-.077h-1.691.44c-.792 0-1.869.187-2.824.231-.62 0-1.237.055-1.846.165a37.337 37.337 0 0 0-23.248 13.467c-.154.154 0 0 .176-.253a32.583 32.583 0 0 0-4.197 6.672 9.704 9.704 0 0 1-.56.98c-.05.157-.117.309-.198.452l-.539 1.442a33.287 33.287 0 0 0-1.35 4.768c-.155.892-.363 1.795-.462 2.643l-.231 2.356c-.055 1.398-.055 2.346-.066 2.411Z"
      />
      <Path
        fill={color}
        d="m46.105 37.58-.102-.015c.003-.22.118-.063.096-.267-.143-.082.02-.338-.055-.41.012.001.017-.098.062-.092-.078-.031-.016-.103-.036-.166-.02-.023-.023.017-.047.033l-.025-.145c.027-.056.073-.07.079-.008.035-.377.15-2.188.123-2.595-.06.051-.023.178-.117.224-.049-.109.021-.158-.031-.206.139-.04.039-.236.18-.315l-.078-.032.05-.052c-.069-.473-.037-.109-.008-.527-.005-.243-.11-.36-.066-.495-.002.02-.05.073-.07.01.07-.01-.043-.168.027-.197-.006-.062.007-.261-.088-.195.048-.033.072-.212.11-.104.005-.06.02-.118.001-.162l-.028.077c-.007-.203.069-.313-.013-.446l-.04.074c-.002-.12-.005-.222.089-.269l.024.125a1.618 1.618 0 0 0-.042-.492l-.005.06c-.086-.215-.127-1.333-.236-1.533l-.074.09-.054-.171c-.002.02.23.087.207.103.004-.363.013-2.25.075-2.584.044-.134.114-.022.127-.02-.022-.166-.074-.073-.063-.212.015-.038.056.008.067.03-.007-.061.02-.117-.013-.122-.028.076-.116.041-.176.072l.014-.18.055.009c.003-.04-.15-.106-.113-.28.035-.298.027-.623.052-.922.032.006.05.069.07.133.002-.04-.004-.102.02-.139-.062.07-.034-.127-.06-.07-.13-.223.006-.505-.08-.7-.122-.02-2.112-.467-2.259-.471.004-.06.01-.12.024-.139-.036.015-.057.133-.038.197l.078.012c.021.146-.048.034-.05.175-.065.005-.073-.125-.074-.24-.012.103-.063.205.006.248-.031.096-.078-.012-.11.104.015.083.075.195.032.289l-.012-.003c-.075.23.084.358.012.569l-.021-.023c-.04.074.003.222-.041.357.015-.04.063-.07.067.01-.047.156-.009.262-.064.375l.059.11c-.032.542-.018 2.686-.025 3.23l-.009-.022c.004.831-.054 2.534.01 3.394-.066.132-.056.315-.078.453.028-.076.072-.05.068.01-.019.423.042.03.058.458.042.491-.066 2.37-.127 2.806.086.234.012.527.066.757l-.021-.023c.028.247-.078 1.642-.049 1.93l.013-.04c.055.251-.046.217-.079.413.103-.026.16.19.167.272l-.022-.003c.016.124.101.402.114.607l-.057-.009c.06.17.032.49.037.612-.026.279-.124.709-.05 1.083l-.161.241.015.036s1.94.385 2.352-.105l.057.007-.006-.097c.027-.116-.038-.17.02-.162l-.008.16c.017-.117.045-.036.077.01a.49.49 0 0 1 .029-.135c-.021-.023-.024.016-.036.035-.02-.063-.073-.15-.046-.227.005-.12.09-.007.097-.147.045-.735.116-1.448.112-2.192.024-.016.023.004.034.025-.023-.224-.01-.423-.033-.628.026-.056.06-.072.084-.088-.023.016-.032-.266-.033-.553 0-.144.003-.29.004-.401.002-.112.006-.187.009-.193Z"
      />
      <Path
        fill={color}
        d="m46.105 49.113-.102-.015c.003-.22.118-.063.096-.267-.143-.082.02-.338-.055-.41.012.001.017-.098.062-.091-.078-.032-.016-.104-.036-.167-.02-.023-.023.017-.047.033l-.025-.145c.027-.056.073-.07.079-.008.035-.377.15-2.188.123-2.595-.06.051-.023.178-.117.224-.049-.109.021-.158-.031-.206.139-.04.039-.236.18-.315l-.078-.032.05-.051c-.069-.474-.037-.11-.008-.528-.005-.243-.11-.36-.066-.495-.002.02-.05.073-.07.01.07-.01-.043-.168.027-.197-.006-.062.007-.261-.088-.195.048-.033.072-.211.11-.104.005-.06.02-.118.001-.162l-.028.077c-.007-.203.069-.313-.013-.446l-.04.075c-.002-.121-.005-.223.089-.27l.024.125a1.618 1.618 0 0 0-.042-.492l-.005.06c-.086-.215-.127-1.333-.236-1.533l-.074.09-.054-.171c-.002.02.23.087.207.103.004-.363.013-2.25.075-2.584.044-.134.114-.022.127-.02-.022-.166-.074-.073-.063-.212.015-.038.056.009.067.03-.007-.061.02-.117-.013-.122-.028.077-.116.042-.176.073l.014-.18.055.008c.003-.04-.15-.106-.113-.28.035-.297.027-.623.052-.922.032.006.05.069.07.133.002-.04-.004-.102.02-.139-.062.07-.034-.127-.06-.07-.13-.223.006-.505-.08-.7-.122-.02-2.112-.467-2.259-.471.004-.06.01-.12.024-.139-.036.015-.057.133-.038.197l.078.013c.021.145-.048.033-.05.174-.065.005-.073-.124-.074-.24-.012.103-.063.205.006.248-.031.096-.078-.012-.11.104.015.083.075.195.032.289l-.012-.002c-.075.23.084.357.012.568l-.021-.023c-.04.075.003.222-.041.357.015-.039.063-.07.067.01-.047.156-.009.262-.064.375l.059.11c-.032.542-.018 2.686-.025 3.23l-.009-.021c.004.83-.054 2.533.01 3.393-.066.132-.056.315-.078.453.028-.076.072-.05.068.01-.019.423.042.03.058.458.042.491-.066 2.37-.127 2.806.086.235.012.527.066.757l-.021-.023c.028.247-.078 1.642-.049 1.93l.013-.04c.055.251-.046.217-.079.413.103-.026.16.19.167.272l-.022-.003c.016.124.101.403.114.607l-.057-.009c.06.17.032.49.037.612-.026.279-.124.709-.05 1.083l-.161.241.015.036s1.94.385 2.352-.105l.057.007-.006-.097c.027-.116-.038-.17.02-.161l-.008.159c.017-.117.045-.036.077.01a.49.49 0 0 1 .029-.135c-.021-.023-.024.016-.036.035-.02-.063-.073-.15-.046-.227.005-.12.09-.007.097-.147.045-.735.116-1.447.112-2.192.024-.016.023.004.034.025-.023-.224-.01-.423-.033-.628.026-.056.06-.071.084-.088-.023.017-.032-.266-.033-.553 0-.144.003-.29.004-.401.002-.112.006-.187.009-.192v-.002Z"
      />
      <Path
        fill={color}
        d="m46.105 52.717-.102-.015c.003-.22.118-.063.096-.267-.143-.082.02-.338-.055-.41.012.001.017-.098.062-.091-.078-.032-.016-.104-.036-.167-.02-.023-.023.017-.047.033l-.025-.145c.027-.056.073-.07.079-.008.035-.377.15-2.188.123-2.595-.06.051-.023.178-.117.224-.049-.109.021-.158-.031-.206.139-.039.039-.236.18-.315l-.078-.031.05-.052c-.069-.474-.037-.11-.008-.528-.005-.243-.11-.36-.066-.494-.002.02-.05.072-.07.01.07-.01-.043-.169.027-.198-.006-.062.007-.261-.088-.195.048-.033.072-.211.11-.104.005-.06.02-.118.001-.161l-.028.076c-.007-.203.069-.313-.013-.446l-.04.075c-.002-.121-.005-.223.089-.27l.024.125a1.62 1.62 0 0 0-.042-.492l-.005.06c-.086-.215-.127-1.333-.236-1.533l-.074.09-.054-.17c-.002.02.23.086.207.102.004-.362.013-2.25.075-2.584.044-.134.114-.022.127-.02-.022-.166-.074-.073-.063-.212.015-.038.056.009.067.031-.007-.062.02-.118-.013-.123-.028.077-.116.042-.176.073l.014-.18.055.008c.003-.04-.15-.106-.113-.28.035-.297.027-.623.052-.922.032.006.05.069.07.133.002-.04-.004-.102.02-.139-.062.07-.034-.127-.06-.07-.13-.223.006-.505-.08-.7-.122-.02-2.112-.467-2.259-.47.004-.061.01-.121.024-.14-.036.015-.057.133-.038.197l.078.013c.021.145-.048.033-.05.174-.065.006-.073-.124-.074-.24-.012.103-.063.205.006.248-.031.096-.078-.012-.11.104.015.083.075.195.032.289l-.012-.002c-.075.23.084.357.012.568l-.021-.023c-.04.075.003.223-.041.357.015-.039.063-.07.067.01-.047.156-.009.262-.064.376l.059.11c-.032.541-.018 2.685-.025 3.229l-.009-.021c.004.83-.054 2.533.01 3.393-.066.132-.056.315-.078.453.028-.076.072-.05.068.011-.019.422.042.03.058.457.042.491-.066 2.37-.127 2.806.086.235.012.527.066.758l-.021-.024c.028.247-.078 1.642-.049 1.93l.013-.04c.055.251-.046.217-.079.413.103-.025.16.19.167.272l-.022-.003c.016.124.101.403.114.607l-.057-.009c.06.17.032.49.037.612-.026.279-.124.709-.05 1.083l-.161.241.015.036s1.94.385 2.352-.105l.057.008-.006-.098c.027-.116-.038-.17.02-.161l-.008.159c.017-.117.045-.036.077.01a.49.49 0 0 1 .029-.135c-.021-.023-.024.016-.036.035-.02-.063-.073-.15-.046-.227.005-.12.09-.007.097-.147.045-.735.116-1.447.112-2.191.024-.017.023.003.034.024-.023-.224-.01-.423-.033-.628.026-.056.06-.072.084-.088-.023.017-.032-.266-.033-.553 0-.144.003-.29.004-.401.002-.112.006-.187.009-.192v-.002ZM42.788 63.364l.127.002c-.004.023-.147.007-.12.028.179.01-.025.037.07.044-.016 0-.022.01-.078.01.097.004.02.011.044.018.026.002.03-.002.06-.004l.03.016a.253.253 0 0 1-.098 0c-.044.041-.188.235-.153.279.074-.006.028-.02.146-.024.06.011-.027.017.038.022-.173.004-.048.025-.226.033l.098.004-.062.005c.086.051.046.012.01.057.007.026.138.038.083.053a.259.259 0 0 1 .086-.001c-.086 0 .055.018-.033.02.008.007-.01.029.11.022-.06.003-.09.022-.138.01-.005.007-.025.013 0 .018l.034-.008c.009.022-.086.033.016.048l.05-.008c.003.013.007.023-.11.029l-.03-.014c-.005.022-.003.035.053.053l.005-.007c.108.023.16.143.295.165l.093-.01.068.018c.002-.002-.29-.01-.26-.01-.005.038-.016.24-.093.276-.055.014-.143.002-.158.002.027.018.092.008.077.023a.34.34 0 0 1-.082-.004c.008.007-.026.013.015.013.035-.008.146-.004.22-.007l-.017.019-.07-.001c-.003.004.188.011.142.03-.043.032-.034.067-.064.099a.278.278 0 0 1-.087-.014c-.003.004.004.01-.027.014.078-.007.043.014.077.008.162.024-.009.054.099.075.153.002 2.64.05 2.823.05-.005.007-.012.013-.03.015.046-.001.071-.014.048-.021l-.097-.001c-.027-.016.06-.004.061-.019.082 0 .092.013.094.026.015-.011.078-.022-.008-.027.039-.01.097.002.138-.011-.02-.009-.095-.02-.04-.03h.014c.095-.025-.104-.039-.014-.061l.026.002c.05-.008-.004-.024.051-.038-.018.004-.078.007-.084-.001.059-.017.012-.028.08-.04l-.073-.012c.04-.058.023-.288.03-.346l.012.002c-.005-.089.067-.271-.013-.363.083-.014.07-.034.098-.049-.035.009-.09.006-.084 0 .023-.046-.053-.004-.073-.05-.053-.052.082-.253.159-.3-.109-.025-.016-.056-.083-.081l.026.002c-.035-.026.097-.175.061-.206l-.016.004c-.068-.027.057-.023.099-.044-.129.003-.2-.02-.209-.03l.028.001c-.02-.013-.127-.043-.142-.065l.07.001c-.074-.018-.04-.052-.046-.066.033-.03.155-.075.063-.115l.201-.026-.02-.004s-2.423-.041-2.94.011h-.07l.008.01c-.035.012.046.018-.025.017l.01-.017c-.022.012-.057.004-.097-.001a.077.077 0 0 1-.036.014c.026.003.03-.001.044-.003.025.006.091.016.059.024-.007.013-.114 0-.122.016-.056.078-.145.155-.14.234-.03.002-.029 0-.042-.002.028.024.013.045.041.067-.033.006-.076.008-.106.01.03-.002.04.028.042.059 0 .015-.004.03-.004.042-.003.012-.008.02-.012.021Z"
      />
      <Path
        fill={color}
        d="m42.788 62.13.127.001c-.004.024-.147.007-.12.029.179.009-.025.036.07.044-.016 0-.022.01-.078.01.097.003.02.01.044.017.026.003.03-.002.06-.003l.03.015a.253.253 0 0 1-.098.001c-.044.04-.188.234-.153.278.074-.006.028-.02.146-.024.06.012-.027.017.038.022-.173.004-.048.025-.226.034l.098.003-.062.006c.086.05.046.011.01.056.007.026.138.039.083.053a.262.262 0 0 1 .086-.001c-.086.001.055.018-.033.021.008.007-.01.028.11.021-.06.004-.09.023-.138.011-.005.007-.025.013 0 .017l.034-.008c.009.022-.086.034.016.048l.05-.008c.003.013.007.024-.11.029l-.03-.014c-.005.022-.003.035.053.053l.005-.006c.108.023.16.142.295.164l.093-.01.068.019c.002-.003-.29-.01-.26-.012-.005.04-.016.241-.093.277-.055.014-.143.002-.158.002.027.018.092.008.077.023a.34.34 0 0 1-.082-.003c.008.006-.026.012.015.013.035-.008.146-.005.22-.008l-.017.02-.07-.002c-.003.005.188.012.142.03-.043.032-.034.067-.064.1a.284.284 0 0 1-.087-.015c-.003.004.004.01-.027.015.078-.008.043.013.077.007.162.024-.009.054.099.075.153.002 2.64.05 2.823.05-.005.007-.012.013-.03.015.046-.001.071-.014.048-.02l-.097-.002c-.027-.016.06-.004.061-.019.082 0 .092.014.094.026.015-.011.078-.022-.008-.027.039-.01.097.002.138-.01-.02-.01-.095-.021-.04-.032h.014c.095-.024-.104-.038-.014-.06l.026.002c.05-.008-.004-.024.051-.038-.018.004-.078.008-.084-.001.059-.017.012-.028.08-.04l-.073-.012c.04-.058.023-.288.03-.346l.012.003c-.005-.09.067-.272-.013-.364.083-.014.07-.033.098-.048-.035.008-.09.005-.084-.001.023-.046-.053-.004-.073-.05-.053-.052.082-.253.159-.3-.109-.025-.016-.056-.083-.08l.026.002c-.035-.027.097-.176.061-.207l-.016.004c-.068-.026.057-.023.099-.044-.129.003-.2-.02-.209-.029h.028c-.02-.013-.127-.043-.142-.065l.07.001c-.074-.018-.04-.052-.046-.065.033-.03.155-.076.063-.116l.201-.026-.02-.004s-2.423-.041-2.94.011h-.07l.008.01c-.035.012.046.018-.025.017l.01-.017c-.022.013-.057.004-.097 0a.078.078 0 0 1-.036.014c.026.002.03-.002.044-.004.025.007.091.016.059.024-.007.013-.114.001-.122.016-.056.079-.145.155-.14.235-.03.001-.029 0-.042-.003.028.024.013.045.041.067-.033.006-.076.008-.106.01.03-.002.04.028.042.059 0 .015-.004.03-.004.043-.003.012-.008.02-.012.02Z"
      />
      <Path
        fill={color}
        d="m42.788 61.744.127.001c-.004.024-.147.007-.12.029.179.009-.025.036.07.044-.016 0-.022.01-.078.01.097.003.02.01.044.017.026.003.03-.001.06-.003l.03.015a.255.255 0 0 1-.098.001c-.044.04-.188.235-.153.278.074-.006.028-.019.146-.024.06.012-.027.017.038.022-.173.004-.048.025-.226.034l.098.003-.062.006c.086.05.046.011.01.056.007.026.138.039.083.053a.261.261 0 0 1 .086 0c-.086 0 .055.017-.033.02.008.007-.01.028.11.021-.06.004-.09.023-.138.011-.005.007-.025.013 0 .018l.034-.009c.009.022-.086.034.016.048l.05-.008c.003.013.007.024-.11.029l-.03-.013c-.005.021-.003.034.053.052l.005-.006c.108.023.16.143.295.164l.093-.01.068.019c.002-.002-.29-.01-.26-.011-.005.038-.016.24-.093.276-.055.015-.143.003-.158.002.027.018.092.008.077.023a.345.345 0 0 1-.082-.003c.008.006-.026.012.015.013.035-.008.146-.005.22-.008l-.017.02-.07-.002c-.003.005.188.012.142.03-.043.032-.034.067-.064.1a.278.278 0 0 1-.087-.015c-.003.004.004.01-.027.015.078-.008.043.013.077.007.162.024-.009.054.099.075.153.002 2.64.05 2.823.05-.005.007-.012.014-.03.016.046-.002.071-.015.048-.022h-.097c-.027-.016.06-.004.061-.02.082 0 .092.014.094.026.015-.01.078-.022-.008-.026.039-.01.097 0 .138-.011-.02-.01-.095-.021-.04-.031h.014c.095-.025-.104-.038-.014-.061l.026.002c.05-.008-.004-.023.051-.038-.018.004-.078.008-.084 0 .059-.018.012-.029.08-.041l-.073-.012c.04-.058.023-.287.03-.346l.012.003c-.005-.09.067-.272-.013-.364.083-.014.07-.033.098-.048-.035.008-.09.005-.084-.001.023-.045-.053-.003-.073-.05-.053-.052.082-.253.159-.3-.109-.025-.016-.056-.083-.08l.026.002c-.035-.027.097-.176.061-.207l-.016.005c-.068-.027.057-.024.099-.045-.129.003-.2-.02-.209-.029h.028c-.02-.013-.127-.043-.142-.064h.07c-.074-.018-.04-.052-.046-.065.033-.03.155-.076.063-.116l.201-.026-.02-.004s-2.423-.04-2.94.012l-.07-.001.008.01c-.035.013.046.019-.025.018l.01-.017c-.022.012-.057.003-.097-.002a.077.077 0 0 1-.036.015c.026.002.03-.002.044-.004.025.007.091.016.059.024-.007.013-.114.001-.122.016-.056.079-.145.155-.14.235-.03.002-.029 0-.042-.003.028.024.013.045.041.067-.033.006-.076.008-.106.01.03-.002.04.028.042.059 0 .015-.004.031-.004.043-.003.012-.008.02-.012.02Z"
      />
    </Svg>
  )
}

export default React.memo(InfoShadowedIcon)