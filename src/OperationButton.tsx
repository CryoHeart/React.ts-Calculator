import { actions } from './App';

export default function OperationButton({ dispatch, operation }: { dispatch: any, operation: any }) {
return (
    <button onClick={() => dispatch({ type: actions.CHOOSE_OPERATION, payload: { operation } })}>

      {operation}

    </button>
  )
}