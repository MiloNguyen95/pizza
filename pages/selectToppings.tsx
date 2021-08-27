import type { NextPage } from 'next'

import GradientBackground from '../components/GradientBackground'

import { Header1, PreTitle, SelectedButtonText } from '../components/Typography'
import styles from '../styles/SelectPizza.module.css'
import { createRef, useState } from 'react'
import GradientButton from '../components/GradientButton'
import ToppingsSlider from '../components/ToppingsSlider'
import { PizzaCrust, PizzaSize, PizzaTopping, Topping } from '../types'
import Pizza from '../components/Pizza'
import { useEffect } from 'react'
import router from 'next/router'
import { getCrustPrice, getSizePrice } from '../utils'

const defaultToppings =[
  {
    name: "Pepperoni",
    price: 0.00,
    icon: "/assets/toppings/pepperoni.png",
    isSelected: false
  },
  {
    name: "Mushroom",
    price: 0.00,
    icon: "/assets/toppings/mushroom.png",
    isSelected: false
  },
  {
    name: "Black Olives",
    price: 0.00,
    icon: "/assets/toppings/olives.png",
    isSelected: false
  },
  {
    name: "Onions",
    price: 0.00,
    icon: "/assets/toppings/onion.png",
    isSelected: false
  },
  {
    name: "Peppers",
    price: 0.00,
    icon: "/assets/toppings/peppers.png",
    isSelected: false
  },
  {
    name: "Pineapple",
    price: 0.00,
    icon: "/assets/toppings/pineapple.png",
    isSelected: false
  },
  {
    name: "Sausages",
    price: 0.00,
    icon: "/assets/toppings/sausages.png",
    isSelected: false
  },
  {
    name: "Spinach",
    price: 0.00,
    icon: "/assets/toppings/spinach.png",
    isSelected: false
  },
  {
    name: "Bacon",
    price: 0.00,
    icon: "/assets/toppings/bacon.png",
    isSelected: false
  },
  {
    name: "Cheese",
    price: 0.00,
    icon: "/assets/toppings/cheese.png",
    isSelected: false
  },
];

const SelectToppings: NextPage = () => {
  const [size, setSize] = useState<PizzaSize>("Small");
  const [crust, setCrust] = useState<PizzaCrust>("Thin");

  useEffect(() => {
    setSize(localStorage.getItem('size') as PizzaSize);
    setCrust((localStorage.getItem('crust') || "Thin") as PizzaCrust);
    const savedToppings = localStorage.getItem('toppings');
    const fetchToppings = (savedToppings && savedToppings!== '[]') ? JSON.parse(savedToppings) : defaultToppings
    setToppings(fetchToppings);
  }, [])

  const [toppings, setToppings] = useState<Topping[]>([]);
  const [confirmedToppings, setConfirmToppings] = useState<Topping[]>();
  const [price, setPrice] = useState(8.00);

  useEffect(() => {
    let calculatedPrice = getSizePrice(size);
    calculatedPrice+= getCrustPrice(crust);
    const selectedToppings = toppings.filter(({isSelected}) => isSelected);
    const additionalPriceforToppings = selectedToppings.length > 3 ? (selectedToppings.length - 3) * 0.5 : 0;
    calculatedPrice += additionalPriceforToppings;
    setConfirmToppings(selectedToppings);
    localStorage.setItem('toppings', JSON.stringify(toppings));
    setPrice(calculatedPrice);
  }, [size, crust, toppings])

  const containerRef = createRef<HTMLInputElement>();


  const goToNextStep = () => {
    localStorage.setItem('toppings', JSON.stringify(confirmedToppings));
    router.push('/verify');
  }

  const onToppingChanged = (name: PizzaTopping, isSelected: boolean) => {
    const _toppings = [...toppings];
    const toppingIndex = _toppings.findIndex((topping) => topping.name === name);
    _toppings[toppingIndex] = { ..._toppings[toppingIndex], isSelected };

    const selectedToppings = _toppings.filter(({isSelected}) => isSelected);

    if(isSelected && selectedToppings.length === 3) {
      const priceUpdatedToppings = _toppings.map((topping) => {
        if(topping.isSelected) return topping;
        return {
          ...topping,
          price: 0.5
        }
      });
      setToppings(priceUpdatedToppings);
      return;
    }

    if(!isSelected) {
      if(selectedToppings.length < 3) {
        const priceUpdatedToppings = _toppings.map((topping) => ({
          ...topping,
          price: 0
        }));
        setToppings(priceUpdatedToppings);
        return;
      }

      if(selectedToppings.length === 3) {
        const priceUpdatedToppings = _toppings.map((topping) => ({
          
            ...topping,
            price: topping.isSelected ? 0 : 0.5
          
        }));
        setToppings(priceUpdatedToppings);
        return;
      }
      
    }

    setToppings(_toppings);
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <GradientBackground height={280}>
          <div className={styles.pizzaBannerContainer}>
            <div>
              <Header1 text="Create Your Pizza" color='white' />
              <div style={{ maxWidth: '300px' }}>
                <PreTitle text={size} color='white' />
                <PreTitle text={`, ${crust}`} color='white' />
                {confirmedToppings && confirmedToppings.length > 0 ? confirmedToppings.map((topping) => <PreTitle key={confirmedToppings.indexOf(topping)} text={`, ${topping.name}`} color='white' style={{letterSpacing: '0'}} />) : <PreTitle text=", toppings" color='rgba(255, 255, 255, 0.3)' />}
              </div>
            </div>
            <Header1 text={`$${price.toFixed(2)}`} />
          </div>
        </GradientBackground>

      </div>
      <Pizza size={size} crust={crust} toppings={confirmedToppings} />
      <div>
        <ToppingsSlider toppings={toppings} style={{ paddingTop: '25px', margin: '21px 20px 39px 20px' }} onChange={onToppingChanged} />
        <GradientButton onClick={goToNextStep} style={{ borderRadius: '0', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><SelectedButtonText text="Next" /></GradientButton>
      </div>
    </div>
  )
}

export default SelectToppings
