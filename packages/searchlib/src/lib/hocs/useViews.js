/**
 * A hook to facilitate interactive with views (listing, card, tables)
 *
 */
import { atom, useAtom } from 'jotai';
import { useAppConfig } from './appConfig';
export const activeViewIdAtom = atom(null);

const useViews = () => {
  const [activeViewId, setActiveViewId] = useAtom(activeViewIdAtom);

  const { appConfig } = useAppConfig();
  const { resultViews } = appConfig;

  const defaultViewId =
    resultViews.filter((v) => v.isDefault)[0]?.id || 'listing';

  return {
    defaultViewId,
    activeViewId: activeViewId || defaultViewId,
    setActiveViewId,
    reset: () => setActiveViewId(defaultViewId),
  };
};

export default useViews;

// import { useAtom } from 'jotai';
// import { activeViewIdAtom } from './state';

// const defaultViewId =
//   resultViews.filter((v) => v.isDefault)[0]?.id || 'listing';
// const [selectedActiveViewId, setActiveViewId] = useAtom(activeViewIdAtom);
// const activeViewId = selectedActiveViewId || defaultViewId;

// React.useEffect(() => {
//   if (!activeViewId) setActiveViewId(defaultViewId);
// }, [activeViewId, defaultViewId, setActiveViewId]);
